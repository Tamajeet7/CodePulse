import { Link } from 'react-router-dom';

import Button from './Button';
import Logo from './Logo';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#05070B]/95 backdrop-blur">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

        <Logo />

        <nav className="flex items-center gap-8">

          <Link
            to="/"
            className="text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            className="text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            Dashboard
          </Link>

          <Link to="/login">
            <Button>
              Login
            </Button>
          </Link>

        </nav>

      </div>

    </header>
  );
}