import bcrypt from "bcrypt";
import { prisma } from "../../config/db";
import crypto from "crypto";
import { generateToken } from "../../utils/jwt";
import { sendPasswordResetEmail } from "../../utils/email";
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
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
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

  static async login(data: {
    email: string;
    password: string;
  }) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const validPassword = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!validPassword) {
      throw new Error("Invalid credentials");
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
}