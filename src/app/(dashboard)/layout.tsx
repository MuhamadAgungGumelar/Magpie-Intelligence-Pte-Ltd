"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import useUIStore from "@/store/uiStore";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { darkMode, setDarkMode } = useUIStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for zustand persist to hydrate before checking auth
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Initialize dark mode from localStorage on mount
  useEffect(() => {
    if (isHydrated) {
      setDarkMode(darkMode);
    }
  }, [isHydrated, darkMode, setDarkMode]);

  useEffect(() => {
    // Only check auth after hydration is complete
    if (isHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  // Show loading during hydration to prevent flash of content
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show loading if not authenticated (being redirected)
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[260px]">
        <Header />
        <main className="flex-1 overflow-auto p-6 mt-[60px] dark:bg-gray-900">{children}</main>
      </div>
    </div>
  );
}
