"use client";

import { useState, useEffect } from "react";
import { FiMenu, FiMoon, FiSun, FiRefreshCw } from "react-icons/fi";

interface HeaderProps {
  onToggleSidebar: () => void;
  lastSyncTime?: string | null;
}

export default function Header({ onToggleSidebar, lastSyncTime }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount before checking localStorage
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 right-0 left-0 z-40">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-[70px] bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 right-0 left-0 z-40">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left side - Hamburger Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Right side - Sync Status & Dark Mode Toggle */}
        <div className="flex items-center gap-4">
          {/* Sync Status */}
          {lastSyncTime && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <FiRefreshCw className="w-4 h-4 text-green-600 dark:text-green-400" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                  Last Sync
                </span>
                <span className="text-xs text-green-600 dark:text-green-400">
                  {lastSyncTime}
                </span>
              </div>
            </div>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <FiSun className="w-5 h-5 text-yellow-500" />
            ) : (
              <FiMoon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
