import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  Maximize,
  Moon,
  Sun,
  User,
  ChevronDown,
  Flag,
  Grid,
  LogOut,
} from "lucide-react";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

    const location = useLocation();
    const currentPath = location.pathname.split('/').filter(Boolean).pop() || 'Dashboard';

    return (
      <header className="sticky top-0 z-30 flex items-center justify-between h-18 px-6 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden lg:flex items-center gap-6">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search data..."
              className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-md text-xs font-bold w-64 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none dark:text-white dark:placeholder-gray-600 shadow-inner"
            />
          </div>
          
          {/* Dynamic Breadcrumbs */}
          <nav className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <Link to="/" className="hover:text-primary-500 transition-colors">Agro</Link>
            <ChevronDown className="w-2.5 h-2.5 mx-2 -rotate-90 opacity-20" />
            <span className="text-gray-800 dark:text-white capitalize">
              {currentPath.replace(/-/g, ' ')}
            </span>
          </nav>
        </div>
      </div>

      <div className="flex items-center space-x-1 md:space-x-3">
        {/* Language/Flag */}
        <button className="hidden sm:p-2 text-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors md:flex items-center">
          <div className="w-6 h-4 bg-gray-200 dark:bg-gray-800 rounded-sm overflow-hidden flex items-center justify-center border border-gray-100 dark:border-gray-700">
            <span className="text-[10px] font-black text-gray-600 dark:text-gray-400">US</span>
          </div>
        </button>

        <button className="hidden sm:p-2 text-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors md:block">
          <Grid className="w-5 h-5" />
        </button>

        <button 
          onClick={toggleFullscreen}
          className="p-2 text-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors md:block"
        >
          <Maximize className="w-5 h-5" />
        </button>

        <button className="p-2 text-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
        </button>

        <button 
          onClick={toggleDarkMode}
          className="p-2 text-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="h-8 w-px bg-gray-100 mx-2"></div>

        <HeadlessMenu as="div" className="relative">
          <HeadlessMenu.Button className="flex items-center space-x-3 p-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group outline-none">
            <div className="w-9 h-9 rounded bg-primary-500 flex items-center justify-center overflow-hidden border border-white dark:border-gray-800 shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white text-xs font-black uppercase tracking-tighter">
                {user?.name?.charAt(0) || "K"}
              </span>
            </div>
            <div className="hidden lg:flex flex-col items-start text-left">
              <span className="text-[12px] font-black text-gray-900 dark:text-white leading-none uppercase tracking-tight">
                {user?.name || settings.short_name}
              </span>
              <span className="text-[9px] font-black text-primary-500 uppercase tracking-widest mt-1 opacity-80">
                {user?.role || "Operator"}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-500 transition-all group-hover:translate-y-0.5" />
          </HeadlessMenu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95 -translate-y-2"
            enterTo="transform opacity-100 scale-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 scale-100 translate-y-0"
            leaveTo="transform opacity-0 scale-95 -translate-y-2"
          >
            <HeadlessMenu.Items className="absolute right-0 mt-3 w-60 origin-top-right bg-white dark:bg-gray-900 rounded-md shadow-2xl ring-1 ring-black/5 focus:outline-none py-2 border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 mb-2 bg-gray-50/30 dark:bg-gray-800/20">
                <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mb-1">User Account</p>
                <p className="text-sm font-black text-gray-800 dark:text-white truncate">{user?.name || "Abdul Khaled"}</p>
                <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Role: {user?.role || "Administrator"}</p>
              </div>
              
              <div className="px-2 space-y-1">
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <Link
                      to="/profile"
                      className={cn(
                        "flex items-center w-full px-4 py-3 text-[12px] font-bold uppercase tracking-wider transition-all rounded",
                        active ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
                      )}
                    >
                      <User className={cn("w-4 h-4 mr-3", active ? "text-white" : "text-primary-500")} />
                      View Profile
                    </Link>
                  )}
                </HeadlessMenu.Item>

                <div className="h-px bg-gray-100 dark:bg-gray-800 my-2 mx-2"></div>

                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={cn(
                        "flex items-center w-full px-4 py-3 text-[12px] font-bold uppercase tracking-wider transition-all rounded",
                        active ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10",
                      )}
                    >
                      <LogOut className={cn("w-4 h-4 mr-3", active ? "text-white" : "text-rose-500")} />
                      Logout System
                    </button>
                  )}
                </HeadlessMenu.Item>
              </div>
            </HeadlessMenu.Items>
          </Transition>
        </HeadlessMenu>
      </div>
    </header>
  );
}
