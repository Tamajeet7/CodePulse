import type { ReactNode } from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageTitle({
  title,
  subtitle,
  action,
}: PageTitleProps) {
  return (
    <div className="mb-12 flex items-center justify-between">

      <div>

        <h1 className="text-5xl font-black tracking-tight text-white">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-3 text-lg text-zinc-400">
            {subtitle}
          </p>
        )}

      </div>

      {action}

    </div>
  );
}