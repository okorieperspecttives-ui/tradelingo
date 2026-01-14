import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-dark-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
