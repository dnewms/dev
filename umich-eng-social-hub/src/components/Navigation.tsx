'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  Send,
  Image,
  BarChart3,
  CheckCircle,
  Sparkles,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Scheduler', href: '/scheduler', icon: Send },
  { name: 'Library', href: '/library', icon: Image },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Approvals', href: '/approvals', icon: CheckCircle },
  { name: 'AI Suggestions', href: '/ai-suggestions', icon: Sparkles },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-umich-blue text-umich-maize shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                <span className="text-umich-maize">M</span>
                <span className="text-white"> Social Hub</span>
              </div>
            </Link>

            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-umich-maize text-umich-blue'
                        : 'text-umich-maize hover:bg-umich-blue/80 hover:text-white'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-umich-maize/80">
              University of Michigan Engineering
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
