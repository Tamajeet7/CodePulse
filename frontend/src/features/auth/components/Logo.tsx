import { Link } from "react-router-dom";
import logoText from "../../../assets/logo-text.jpg";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center justify-center mb-2">
      <img 
        src={logoText} 
        alt="CodePulse" 
        className="h-32 w-auto object-contain invert mix-blend-screen" 
      />
    </Link>
  );
}