'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  lastSyncTime?: string | null;
}

export default function DashboardLayoutClient({ children, lastSyncTime }: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[260px]' : 'ml-0'}`}>
        <Header onToggleSidebar={toggleSidebar} lastSyncTime={lastSyncTime} />
        <main className="pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
