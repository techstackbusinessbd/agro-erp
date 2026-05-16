import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import * as LucideIcons from "lucide-react";
import { ChevronRight, Layout, ChevronDown } from "lucide-react";
import { APP_CONFIG } from "../../config/constants";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { menuApi } from "../../features/dashboard/api/menuApi";
import { useSettings } from "../../contexts/SettingsContext";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const IconRenderer = ({ name, className }) => {
  const Icon = LucideIcons[name] || LucideIcons.Circle;
  return <Icon className={className} />;
};

const SidebarItem = ({ item, isMini, level = 0 }) => {
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  
  // Check if any child is active
  const isChildActive = (children) => {
    if (!children) return false;
    return children.some(child => {
      if (child.path && location.pathname === child.path) return true;
      if (child.children) return isChildActive(child.children);
      return false;
    });
  };

  const [isOpen, setIsOpen] = useState(isChildActive(item.children));

  // Auto-expand when a child is active, or auto-collapse if not
  useEffect(() => {
    if (hasChildren) {
      setIsOpen(isChildActive(item.children));
    }
  }, [location.pathname]);
  
  const toggleSubmenu = (e) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="w-full">
      {item.type === "header" ? (
        !isMini && (
          <div className="px-4 py-2 mt-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            {item.label}
          </div>
        )
      ) : (
        <>
          <NavLink
            to={item.path || "#"}
            onClick={toggleSubmenu}
            className={({ isActive }) =>
              cn(
                "flex items-center justify-between px-4 py-3 rounded-md transition-all duration-300 group relative overflow-hidden",
                isActive && !hasChildren
                  ? "text-primary-500 font-bold bg-primary-500/10 shadow-inner"
                  : "text-gray-400 hover:bg-white/5 hover:text-white",
                level > 0 && !isMini ? "pl-8" : "",
                level > 1 && !isMini ? "pl-12" : ""
              )
            }
          >
            {/* Active Indicator Bar */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full transform -translate-x-full group-[.active]:translate-x-0 transition-transform duration-300"></div>
            
            <div className="flex items-center z-10">
              <IconRenderer
                name={level > 0 ? "Circle" : (item.icon || "CircleDot")}
                className={cn(
                  level > 0 
                    ? "w-2 h-2 ml-1 mr-4 opacity-50" 
                    : "w-5 h-5 mr-3.5",
                  "shrink-0 transition-all duration-300 group-hover:scale-110",
                  isMini ? "mx-auto" : ""
                )}
              />
              {!isMini && <span className="text-[13px] uppercase tracking-wider">{item.label}</span>}
            </div>
            {!isMini && hasChildren && (
              <div className="transition-transform duration-300 z-10">
                {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-primary-500" /> : <ChevronRight className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100" />}
              </div>
            )}
            
            {/* Subtle Active Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent opacity-0 group-[.active]:opacity-100 transition-opacity duration-500"></div>
          </NavLink>
          
          {hasChildren && isOpen && !isMini && (
            <div className="mt-1 space-y-1">
              {item.children.map((child) => (
                <SidebarItem key={child.id} item={child} isMini={isMini} level={level + 1} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default function Sidebar({ isMini, isMobileOpen }) {
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await menuApi.getSidebarMenu();
        if (response.status === 'Success') {
          setNavItems(response.data);
        }
      } catch (error) {
        console.error("Failed to load sidebar menu", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-[#2b3135] text-gray-400 border-r border-gray-800 shadow-xl",
        isMini ? "w-20" : "w-64",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      {/* Dark Sidebar Header */}
      <div className="flex items-center px-6 h-18 bg-[#24292d] border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-500 rounded-md flex items-center justify-center shadow-lg shadow-primary-500/30 group cursor-pointer overflow-hidden relative">
            <Layout className="w-5 h-5 text-white z-10 transition-transform group-hover:rotate-12" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          {!isMini && (
            <div className="flex flex-col">
              <span className="text-[16px] font-black text-white tracking-tight leading-none">
                Agro <span className="text-primary-500">ERP</span>
              </span>
              <span className="text-[8px] font-black text-primary-500/60 uppercase tracking-[0.2em] mt-1">Enterprise</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-[calc(100vh-72px)] overflow-y-auto overflow-x-hidden py-4 scrollbar-hide">
        <nav className="space-y-1 px-3">
          {loading ? (
            <div className="flex items-center justify-center h-20">
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            navItems.map((item) => (
              <SidebarItem key={item.id} item={item} isMini={isMini} />
            ))
          )}
        </nav>
      </div>
    </aside>
  );
}
