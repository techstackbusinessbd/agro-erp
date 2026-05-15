import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Folder,
  ClipboardList,
  Layers,
  Users,
  Settings,
  ChevronRight,
  Circle,
  Layout,
  Briefcase,
  Globe,
} from "lucide-react";
import { APP_CONFIG } from "../../config/constants";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { label: "Menu", type: "header" },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { label: "Apps", type: "header" },
  { path: "/calendar", label: "Calendar", icon: Calendar },
  { path: "/tickets", label: "Tickets", icon: Ticket },
  { path: "/file-manager", label: "File Manager", icon: Folder },
  { path: "/kanban", label: "Kanban", icon: ClipboardList },
  { path: "/project", label: "Project", icon: Briefcase, hasSub: true },
  { label: "Custom", type: "header" },
  { path: "/auth", label: "Auth Pages", icon: Globe, hasSub: true },
  { path: "/extra", label: "Extra Pages", icon: Layers, hasSub: true },
  { path: "/layout", label: "Layout", icon: Layout, hasSub: true },
];

export default function Sidebar({ isMini, isMobileOpen }) {
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-[#2b3135] text-gray-400 border-r border-gray-800 shadow-xl",
        isMini ? "w-20" : "w-64",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      {/* Dark Sidebar Header */}
      <div className="flex items-center px-6 h-18 bg-[#24292d]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Layout className="w-5 h-5 text-white" />
          </div>
          {!isMini && (
            <span className="text-xl font-bold text-white tracking-tight uppercase">
              {APP_CONFIG.SHORT_NAME}
            </span>
          )}
        </div>
      </div>

      <div className="h-[calc(100vh-72px)] overflow-y-auto overflow-x-hidden py-4 scrollbar-hide">
        <nav className="space-y-1 px-3">
          {navItems.map((item, index) => {
            if (item.type === "header") {
              return !isMini ? (
                <div
                  key={`header-${index}`}
                  className="px-4 py-2 mt-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest"
                >
                  {item.label}
                </div>
              ) : (
                <div key={`header-${index}`} className="h-4" />
              );
            }

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between px-4 py-2.5 rounded-md transition-all duration-200 group",
                    isActive
                      ? "bg-primary-500/10 text-primary-500 font-semibold border-l-4 border-primary-500 rounded-l-none"
                      : "text-gray-400 hover:bg-white/5 hover:text-white",
                  )
                }
              >
                <div className="flex items-center">
                  <Icon
                    className={cn(
                      "w-5 h-5 shrink-0 transition-colors",
                      isMini ? "mx-auto" : "mr-3",
                    )}
                  />
                  {!isMini && <span className="text-[14px]">{item.label}</span>}
                </div>
                {!isMini && item.hasSub && (
                  <ChevronRight className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100 transition-opacity" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
