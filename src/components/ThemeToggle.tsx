'use client';

import { useTheme } from '@/lib/theme/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { mode, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full border border-gold-500/20 text-gold-500 hover:bg-gold-500/10 transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
