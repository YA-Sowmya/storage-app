import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-darkBlue overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 h-full relative">
        <div className="sticky top-0 z-30">
          <Navbar toggleSidebar={() => setSidebarOpen(true)} />
        </div>

        <main className="flex-1 overflow-y-auto rounded-xl bg-black p-1 sm:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
