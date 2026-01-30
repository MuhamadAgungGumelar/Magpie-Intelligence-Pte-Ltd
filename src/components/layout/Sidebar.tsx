"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  // FiBarChart2,
  // FiShoppingCart,
  // FiPackage,
  FiActivity,
} from "react-icons/fi";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: FiHome },
  // { path: "/analytics", label: "Analytics", icon: FiBarChart2 },
  // { path: "/orders", label: "Orders", icon: FiShoppingCart },
  // { path: "/products", label: "Products", icon: FiPackage },
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
        className={`flex items-center px-4 py-3 rounded-lg transition-all cursor-pointer ${
          isActive
            ? "bg-blue-500 text-white hover:bg-blue-600"
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

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const pathname = usePathname();

  return (
    <div className={`w-[260px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0 overflow-y-auto transition-transform duration-300 z-50 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="h-[70px] flex items-center justify-start px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <FiActivity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              E-commerce
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Analytics
            </p>
          </div>
        </div>
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

      <hr className="border-gray-200 dark:border-gray-700 mx-4" />

      {/* <div className="p-4">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 mt-2">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
            Magpie Technical Test
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Next.js + Prisma + Trigger.dev
          </p>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
          v1.0.0
        </p>
      </div> */}
    </div>
  );
};

export default Sidebar;
