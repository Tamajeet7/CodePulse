import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

export default function Container({
  children,
}: ContainerProps) {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-8 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
      {children}
    </div>
  );
}