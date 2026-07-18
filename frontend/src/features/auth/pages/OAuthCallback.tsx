import { useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useAuthStore } from "../../../store/authStore";
import { oauthLogin } from "../../../services/auth.api";

export default function OAuthCallback() {
  const { provider } = useParams<{ provider: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const code = searchParams.get("code");
    
    if (!code || !provider) {
      navigate("/login?error=Missing_OAuth_Code");
      return;
    }

    const authenticate = async () => {
      try {
        const response = await oauthLogin(provider, code);
        login(response.token!, response.user!);
        navigate("/dashboard");
      } catch (error: any) {
        console.error("OAuth error:", error);
        navigate(`/login?error=${encodeURIComponent(error.response?.data?.message || "OAuth Failed")}`);
      }
    };

    authenticate();
  }, [provider, searchParams, navigate, login]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        <p className="text-sm text-neutral-400">Authenticating...</p>
      </div>
    </div>
  );
}
