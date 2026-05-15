import React from "react";
import { Layout } from "lucide-react";
import { APP_CONFIG } from "../../config/constants";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white">
      <div className="relative">
        {/* Outer Pulsing Ring */}
        <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping duration-1000"></div>

        {/* Main Logo Container */}
        <div className="relative w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20 animate-bounce duration-700">
          <Layout className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Text with shimmer effect */}
      <div className="mt-8 flex flex-col items-center">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight uppercase">
          {APP_CONFIG.SHORT_NAME}
        </h2>
        <div className="mt-2 flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce"></div>
        </div>
        <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
          Loading Experience...
        </p>
      </div>
    </div>
  );
}
