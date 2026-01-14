import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/theme/ThemeContext';
import { AuthProvider } from '@/lib/auth/AuthContext';
import MotionBackground from '@/components/MotionBackground';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap', weight: ['400', '700'] });

export const metadata: Metadata = {
  title: 'TradeLingo',
  description: 'Professional Forex Learning Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} bg-dark-bg min-h-screen font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
        <MotionBackground />
      </body>
    </html>
  );
}
