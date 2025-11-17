import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-md border border-gray-200',
        padding && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
}
