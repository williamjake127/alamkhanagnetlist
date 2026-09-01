"use client";

import React, { useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AdminBottomNav } from "@/components/admin/AdminBottomNav";
import { AgentFormModal } from "@/components/admin/AgentFormModal";
import { usePathname, useRouter } from "next/navigation";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin-panel/login";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d12] flex items-center justify-center text-primary font-hind">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-gray">Loading Admin Center...</p>
        </div>
      </div>
    );
  }

  // If not logged in and not on login page, redirect to login
  if (!user && !isLoginPage) {
    router.replace("/admin-panel/login");
    return null;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#090d12] text-white flex flex-col font-hind selection:bg-primary selection:text-black">
      {/* Desktop Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminNavbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          title={
            pathname === "/admin-panel"
              ? "Dashboard Overview"
              : pathname === "/admin-panel/agents"
              ? "Agent Directory"
              : pathname === "/admin-panel/support"
              ? "Helpline Numbers"
              : pathname === "/admin-panel/settings"
              ? "Portal Settings"
              : "Admin Portal"
          }
        />

        {/* Page Content with safe padding for mobile bottom bar */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (100% responsive) */}
      <AdminBottomNav onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Global Quick Add Agent Modal */}
      <AgentFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          // Trigger refresh event for pages
          window.dispatchEvent(new Event("agents-updated"));
        }}
      />
    </div>
  );
}

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
