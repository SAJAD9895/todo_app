import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Sidebar from '../components/ui/Sidebar';
import { useNotifications } from '../hooks/useNotifications';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useNotifications();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
