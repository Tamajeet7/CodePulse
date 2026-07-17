import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
}

export default function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-700 bg-[#0D1117] p-10">

      {icon}

      <h2 className="mt-6 text-3xl font-bold text-white">
        {title}
      </h2>

      <p className="mt-3 max-w-md text-center text-zinc-400">
        {description}
      </p>

    </div>
  );
}