"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard, MdTableChart } from "react-icons/md";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: MdDashboard },
  { path: "/articles", label: "Articles", icon: MdTableChart },
];

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon: Icon,
  label,
  isActive,
}) => {
  return (
    <Link href={to} className="w-full">
      <div
        className={`flex items-center px-4 py-3 rounded-md transition-all cursor-pointer ${
          isActive
            ? "bg-red-500 text-white hover:bg-red-600"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className={`ml-3 ${isActive ? "font-semibold" : "font-normal"}`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="w-[260px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="h-[60px] flex items-center justify-start pl-8 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-red-500">News Management</h2>
      </div>

      <div className="flex flex-col gap-1 p-4">
        {menuItems.map((item) => (
          <SidebarLink
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.path}
          />
        ))}
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      <div className="p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
