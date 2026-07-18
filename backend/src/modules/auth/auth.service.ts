import bcrypt from "bcrypt";
import { prisma } from "../../config/db";
import crypto from "crypto";
import { generateToken } from "../../utils/jwt";
import { sendPasswordResetEmail, sendOTPEmail } from "../../utils/email";
import { env } from "../../config/env";


export class AuthService {
  static async register(data: {
    name: string;
    email: string;
    password: string;
  }) {

    const users = await prisma.user.findMany();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      if (existingUser.isVerified) {
        throw new Error("User already exists");
      }
      
      // If user exists but is not verified, we can resend OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(otpCode, 10);
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      const hashedPassword = await bcrypt.hash(data.password, 10);

      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          otpCode: hashedOtp,
          otpExpiry,
        }
      });

      await sendOTPEmail(existingUser.email, otpCode);

      return {
        requiresOtp: true,
        userId: existingUser.id,
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otpCode, 10);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        otpCode: hashedOtp,
        otpExpiry,
      },
    });

    await sendOTPEmail(user.email, otpCode);

    return {
      requiresOtp: true,
      userId: user.id,
    };
  }

  static async login(data: {
    email: string;
    password: string;
  }) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }

    const validPassword = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!validPassword) {
      throw new Error("Invalid credentials");
    }

    if (!user.isVerified) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(otpCode, 10);
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          otpCode: hashedOtp,
          otpExpiry,
        }
      });

      await sendOTPEmail(user.email, otpCode);

      return {
        requiresOtp: true,
        userId: user.id,
      };
    }

    const token = generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  static async verifyOtp(userId: string, code: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.otpCode || !user.otpExpiry || user.otpExpiry < new Date()) {
      throw new Error("OTP code has expired or is invalid");
    }

    const isValid = await bcrypt.compare(code, user.otpCode as string);
    if (!isValid) {
      throw new Error("Invalid verification code");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpiry: null,
      },
    });

    const token = generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        success: true,
        message:
          "If an account with that email exists, a reset link has been sent.",
      };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const expiry = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: expiry,
      },
    });

    const resetLink = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(
      user.name,
      user.email,
      resetLink
    );

    return {
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent.",
    };
  }

  static async resetPassword(
    token: string,
    password: string
  ) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error(
        "Reset link is invalid or has expired."
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);
      await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,

        resetPasswordToken: null,

        resetPasswordExpiry: null,
      },
    });

    return {
      success: true,
      message: "Password reset successfully.",
    };
  }

  static async github(code: string) {
    const { default: axios } = await import("axios");
    
    // 1. Exchange code for access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) throw new Error("Failed to get GitHub access token");

    // 2. Fetch user profile
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const githubUser = userResponse.data;

    // 3. Fetch user emails
    const emailsResponse = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const primaryEmail = emailsResponse.data.find((e: any) => e.primary)?.email;
    if (!primaryEmail) throw new Error("No primary email found on GitHub account");

    // 4. Find or Create User
    let user = await prisma.user.findUnique({
      where: { email: primaryEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: primaryEmail,
          name: githubUser.name || githubUser.login,
          githubId: String(githubUser.id),
          githubAccessToken: accessToken,
        },
      });
    } else {
      // Link GitHub if not linked
      await prisma.user.update({
        where: { id: user.id },
        data: {
          githubId: String(githubUser.id),
          githubAccessToken: accessToken,
          isVerified: true, // OAuth verifies email
        },
      });
    }

    const token = generateToken(user.id);
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  static async google(code: string) {
    const { default: axios } = await import("axios");
    
    // 1. Exchange code for access token
    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: `${env.CLIENT_URL}/auth/google/callback`,
    });

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) throw new Error("Failed to get Google access token");

    // 2. Fetch user profile
    const userResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const googleUser = userResponse.data;
    if (!googleUser.email) throw new Error("No email found on Google account");

    // 3. Find or Create User
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || "Google User",
          googleId: String(googleUser.id),
          googleAccessToken: accessToken,
        },
      });
    } else {
      // Link Google if not linked
      await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: String(googleUser.id),
          googleAccessToken: accessToken,
          isVerified: true, // OAuth verifies email
        },
      });
    }

    const token = generateToken(user.id);
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}