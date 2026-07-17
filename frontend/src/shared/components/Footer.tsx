import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-10">

        <Logo />

        <p className="text-sm text-zinc-500">
          © 2026 DevSync
        </p>

      </div>

    </footer>
  );
}