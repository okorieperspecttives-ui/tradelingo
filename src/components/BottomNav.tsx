'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, LineChart, MessageSquare, User } from 'lucide-react';
import clsx from 'clsx';

const items = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Learn', icon: BookOpen, href: '/dashboard/learn' },
  { name: 'Simulator', icon: LineChart, href: '/dashboard/simulator' },
  { name: 'Community', icon: MessageSquare, href: '/dashboard/community' },
  { name: 'Profile', icon: User, href: '/dashboard/profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-dark-card border-t border-gold-500/10 md:hidden">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className="py-3 flex flex-col items-center justify-center">
              <Icon
                size={22}
                className={clsx(isActive ? 'text-gold-500' : 'text-gray-400')}
              />
              <span className={clsx('text-xs mt-1', isActive ? 'text-gold-500' : 'text-gray-400')}>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

