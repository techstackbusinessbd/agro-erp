import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function AdminLayout() {
    const [isMiniSidebar, setIsMiniSidebar] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    // Close mobile sidebar when navigating
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    const toggleSidebar = () => {
        if (window.innerWidth <= 768) {
            setIsMobileOpen(!isMobileOpen);
        } else {
            setIsMiniSidebar(!isMiniSidebar);
        }
    };

    const closeMobileSidebar = () => {
        setIsMobileOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-[#f8f7fa] dark:bg-gray-950 transition-colors">
            {/* Sidebar Component */}
            <Sidebar isMini={isMiniSidebar} isMobileOpen={isMobileOpen} />
            
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity md:hidden" 
                    onClick={closeMobileSidebar}
                />
            )}

            {/* Main Content Area */}
            <main 
                className={cn(
                    "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
                    isMiniSidebar ? "md:ml-20" : "md:ml-64"
                )}
            >
                <Header toggleSidebar={toggleSidebar} />
                
                <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
                    <div className="w-full">
                        <Outlet />
                    </div>
                </div>

                {/* Sticky Footer */}
                <footer className="sticky bottom-0 z-20 px-8 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400 text-center md:text-left flex flex-col md:flex-row justify-between items-center shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
                    <div>
                        © {new Date().getFullYear()} <span className="font-semibold text-primary-600">Agro ERP</span>. All rights reserved.
                    </div>
                    <div className="mt-2 md:mt-0 flex space-x-4">
                        <a href="#" className="hover:text-primary-500 transition-colors">Support</a>
                        <a href="#" className="hover:text-primary-500 transition-colors">Documentation</a>
                    </div>
                </footer>
            </main>
        </div>
    );
}
