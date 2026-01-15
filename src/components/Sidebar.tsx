'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, BookOpen, LineChart, MessageSquare, Trophy, Settings, Menu, X, LogOut, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import clsx from 'clsx';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-toastify';
import { useAuth } from '@/lib/auth/AuthContext';


const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Learn', icon: BookOpen, href: '/dashboard/learn' },
  { name: 'Simulator', icon: LineChart, href: '/dashboard/simulator' },
  { name: 'Community', icon: MessageSquare, href: '/dashboard/community' },
  { name: 'Leaderboard', icon: Trophy, href: '/dashboard/leaderboard' },
];

const secondaryItems = [
  { name: 'Profile', icon: User, href: '/dashboard/profile' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [openMobile, setOpenMobile] = useState(false);
  const {user} = useAuth()
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error logging out');
    }
  }

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setOpenMobile(!openMobile)} className="p-2 bg-dark-card border border-gold-500/20 rounded-md text-gold-500 cursor-pointer">
          {openMobile ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {openMobile && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setOpenMobile(false)} />}

      <motion.aside
        initial={{ width: 240 }}
        animate={{ width: isCollapsed ? 80 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={clsx('fixed left-0 top-0 h-screen bg-dark-card border-r border-gold-500/10 z-40 flex flex-col shadow-xl', openMobile ? 'flex' : 'hidden', 'md:flex')}
      >
        <div className="h-16 flex items-center px-4 border-b border-gold-500/10">
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-gold-500/10 rounded-full transition-colors text-gold-500 mr-2 cursor-pointer">
            <Menu size={24} />
          </button>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="font-serif text-xl font-bold text-gold-500 whitespace-nowrap overflow-hidden">
                TradeLingo
              </motion.div>
            )}
          </AnimatePresence>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-2 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={clsx('flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 group relative', isActive ? 'bg-gold-500/10 text-gold-500' : 'text-gray-600 hover-bg-border hover:text-gray-900')}>
                  <item.icon size={24} className={clsx('min-w-[24px]', isActive && 'text-gold-500')} />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="ml-4 font-medium whitespace-nowrap overflow-hidden">
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isCollapsed && <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-gold-500 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap border border-gold-500/20 z-50">{item.name}</div>}
                </div>
              </Link>
            );
          })}

          <div className="my-4 border-t border-gray-800 mx-2" />

          {secondaryItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={clsx('flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 group relative', isActive ? 'bg-gold-500/10 text-gold-500' : 'text-gray-600 hover-bg-border hover:text-gray-900')}>
                  <item.icon size={24} className="min-w-[24px]" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="ml-4 font-medium whitespace-nowrap overflow-hidden">
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isCollapsed && <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-gold-500 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap border border-gold-500/20 z-50">{item.name}</div>}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gold-500/10">
          <div className={clsx('flex items-center', isCollapsed ? 'justify-center' : 'gap-3')}>
            <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-black font-bold">U</div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">User Name</p>
                <p className="text-xs text-gray-500 truncate">Pro Trader</p>
              </div>
            )}
            {!isCollapsed && user && <button className="text-gray-400 hover:text-white cursor-pointer"><LogOut onClick={handleLogout} size={18} /></button>}
          </div>
        </div>
      </motion.aside>

      <motion.div animate={{ width: isCollapsed ? 80 : 240 }} className="hidden md:block flex-shrink-0 h-screen" />
    </>
  );
}
