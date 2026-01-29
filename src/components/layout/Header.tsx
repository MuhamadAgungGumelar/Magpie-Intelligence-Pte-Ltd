"use client";

import React, { useState } from "react";
import { MdLogout, MdSync, MdDarkMode, MdLightMode } from "react-icons/md";
import useAuthStore from "@/store/authStore";
import useUIStore from "@/store/uiStore";
import { useSync } from "@/hooks/useSync";
import { formatRelative } from "@/lib/utils/date";
import { toast } from "sonner";
import LogoutConfirmDialog from "@/components/common/LogoutConfirmDialog";
import SyncConfirmDialog from "../common/SyncConfirmDialog";

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useUIStore();
  const { syncing, lastSyncAt, triggerSync } = useSync();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSyncConfirm, setShowSyncConfirm] = useState(false);

  const handleSync = async () => {
    try {
      const result = await triggerSync();
      toast.success(`Synced ${result.syncedCount} new articles successfully`);
    } catch (error: unknown) {
      let message = "Failed to sync articles";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          message = axiosError.response.data.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    } finally {
      setShowSyncConfirm(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutConfirm(false);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <header className="h-[60px] bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 right-0 left-[260px] z-10">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4"></div>

        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <MdLightMode className="w-5 h-5" />
            ) : (
              <MdDarkMode className="w-5 h-5" />
            )}
          </button>

          {/* Sync Button */}
          <button
            onClick={() => setShowSyncConfirm(true)}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MdSync className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync Now"}
          </button>

          {lastSyncAt && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Last sync: {formatRelative(lastSyncAt)}
            </span>
          )}

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium dark:text-gray-200">
              {user?.name || "User"}
            </span>
            <button
              onClick={handleLogoutClick}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              aria-label="Logout"
            >
              <MdLogout className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        open={showLogoutConfirm}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />

      <SyncConfirmDialog
        open={showSyncConfirm}
        onConfirm={handleSync}
        onCancel={() => setShowSyncConfirm(false)}
        syncing={syncing}
      />
    </header>
  );
};

export default Header;
