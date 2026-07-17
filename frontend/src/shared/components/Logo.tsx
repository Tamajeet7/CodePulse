import logoIcon from "../../assets/logo-icon.jpg";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <img 
        src={logoIcon} 
        alt="CodePulse Icon" 
        className="h-10 w-10 rounded-xl object-contain invert mix-blend-screen" 
      />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          CodePulse
        </h1>
      </div>
    </div>
  );
}