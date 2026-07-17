import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 mb-8">
      <div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center">
        <Activity className="h-6 w-6 text-background" />
      </div>
      <span className="font-bold text-2xl tracking-tight text-foreground">CodePulse</span>
    </Link>
  );
}