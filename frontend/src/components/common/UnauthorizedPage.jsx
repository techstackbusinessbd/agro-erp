import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-danger/20 blur-3xl rounded-full"></div>
          <div className="relative bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl border border-danger/10">
            <ShieldAlert className="w-20 h-20 text-danger mx-auto" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Access Denied
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            You don't have permission to access this area. Please contact your administrator if you believe this is an error.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all active:scale-95"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        <p className="text-[11px] text-gray-400 dark:text-gray-600 font-medium uppercase tracking-widest pt-8">
          Agro ERP Security System
        </p>
      </div>
    </div>
  );
}
