import React from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  Maximize,
  Moon,
  User,
  ChevronDown,
  Flag,
  Grid,
} from "lucide-react";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-18 px-6 bg-white border-b border-gray-100">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden lg:flex items-center relative group">
          <Search className="w-4 h-4 absolute left-3 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center space-x-1 md:space-x-3">
        {/* Language/Flag */}
        <button className="hidden sm:p-2 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors md:flex items-center">
          <div className="w-6 h-4 bg-gray-200 rounded-sm overflow-hidden flex items-center justify-center">
            <span className="text-[10px] font-bold text-gray-600">US</span>
          </div>
        </button>

        <button className="hidden sm:p-2 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors md:block">
          <Grid className="w-5 h-5" />
        </button>

        <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors md:block">
          <Maximize className="w-5 h-5" />
        </button>

        <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-4 right-[134px] w-2 h-2 bg-danger rounded-full border-2 border-white md:right-[150px]"></span>
        </button>

        <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors">
          <Moon className="w-5 h-5" />
        </button>

        <div className="h-8 w-px bg-gray-100 mx-2"></div>

        <HeadlessMenu as="div" className="relative">
          <HeadlessMenu.Button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 transition-all group">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center overflow-hidden border-2 border-primary-50 shadow-sm">
              <span className="text-white text-xs font-bold">
                {user?.name?.charAt(0) || "K"}
              </span>
            </div>
            <div className="hidden lg:flex flex-col items-start text-left">
              <span className="text-sm font-semibold text-gray-700 leading-none">
                {user?.name || APP_CONFIG.SHORT_NAME}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-all" />
          </HeadlessMenu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1 border border-gray-100">
              <div className="px-4 py-2 border-bottom text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Welcome!
              </div>
              <HeadlessMenu.Item>
                {({ active }) => (
                  <Link
                    to="/profile"
                    className={cn(
                      "flex items-center w-full px-4 py-2 text-sm text-gray-700 transition-colors",
                      active ? "bg-primary-50 text-primary-600" : "",
                    )}
                  >
                    <User className="w-4 h-4 mr-3" />
                    My Profile
                  </Link>
                )}
              </HeadlessMenu.Item>
              <div className="h-px bg-gray-50 my-1"></div>
              <HeadlessMenu.Item>
                {({ active }) => (
                  <button
                    onClick={logout}
                    className={cn(
                      "flex items-center w-full px-4 py-2 text-sm text-danger transition-colors",
                      active ? "bg-danger/5" : "",
                    )}
                  >
                    <span className="w-4 h-4 mr-3"></span>
                    Logout
                  </button>
                )}
              </HeadlessMenu.Item>
            </HeadlessMenu.Items>
          </Transition>
        </HeadlessMenu>
      </div>
    </header>
  );
}
