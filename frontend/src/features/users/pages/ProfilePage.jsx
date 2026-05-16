import React, { useState } from "react";
import { User, Mail, Shield, Camera, Lock, Bell, Globe, Save, Edit2, X, Info } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSave = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Synchronizing matrix...',
        success: <b className="text-[11px] font-black uppercase tracking-widest">Profile Updated successfully</b>,
        error: <b className="text-[11px] font-black uppercase tracking-widest">Update Failed</b>,
      }
    ).then(() => {
      setIsEditing(false);
    });
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Discard changes?",
      text: "Modified parameters will be reset to default state.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#f43f5e",
      confirmButtonText: "Yes, discard",
      cancelButtonText: "Keep editing",
      background: document.documentElement.classList.contains('dark') ? '#111827' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
      customClass: {
        title: "text-lg font-black uppercase tracking-tight",
        htmlContainer: "text-[11px] font-bold text-gray-400 uppercase tracking-widest",
        confirmButton: "px-6 py-2.5 rounded font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20",
        cancelButton: "px-6 py-2.5 rounded font-black uppercase tracking-widest shadow-lg shadow-rose-500/20"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setIsEditing(false);
      }
    });
  };

  return (
    <div className="pb-10 min-h-screen space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Premium Page Header */}
      <div className="sticky top-4 z-30 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-md border border-gray-100/50 dark:border-gray-800/50 shadow-xl shadow-gray-500/5 transition-all mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary-500" />
            </div>
            <span className="text-[10px] font-extrabold text-primary-500 uppercase tracking-[0.2em]">Personal Node</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Identity Profile</h1>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">Security & Preferences Matrix</p>
        </div>

        {!isEditing ? (
          <button 
            onClick={toggleEdit}
            className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-md shadow-sm hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-300 active:scale-95"
          >
            <Edit2 className="w-4 h-4 text-primary-500" />
            Modify Profile
          </button>
        ) : (
          <div className="flex items-center gap-4">
             <button 
              onClick={handleCancel}
              className="flex items-center gap-3 px-8 py-4 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-black text-[11px] uppercase tracking-[0.2em] rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 active:scale-95"
            >
              <X className="w-4 h-4" />
              Discard
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-3 px-8 py-4 bg-primary-500 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-md shadow-2xl shadow-primary-500/20 hover:bg-primary-600 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              Push Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Sidebar Info */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-500">
            <div className="h-28 bg-primary-500/10 dark:bg-primary-500/5 border-b border-primary-500/10"></div>
            <div className="p-8 pt-0 -mt-14 flex flex-col items-center text-center">
              <div className="relative group/avatar">
                <div className="w-28 h-28 rounded-md bg-white dark:bg-gray-800 p-1 shadow-2xl transition-all">
                  <div className="w-full h-full rounded bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center overflow-hidden border-2 border-white dark:border-primary-500/30 transition-all">
                    <span className="text-4xl font-black text-primary-500 tracking-tighter">
                      {user?.name?.charAt(0) || "A"}
                    </span>
                  </div>
                </div>
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 p-2.5 bg-primary-500 rounded shadow-2xl text-white hover:scale-110 transition-all border-4 border-white dark:border-gray-800 animate-in zoom-in duration-200">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <h2 className="mt-6 text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight transition-colors">{user?.name || "Agro Operator"}</h2>
              <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mt-1 transition-colors">{user?.role || "System Administrator"}</p>
              
              <div className="mt-8 w-full space-y-4">
                <div className="flex items-center gap-4 text-[11px] font-bold text-gray-500 dark:text-gray-400 p-4 rounded-md bg-gray-50/50 dark:bg-gray-800/50 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                  <Mail className="w-4 h-4 text-primary-500" />
                  <span className="truncate">{user?.email || "operator@agro-erp.enterprise"}</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-bold text-gray-500 dark:text-gray-400 p-4 rounded-md bg-gray-50/50 dark:bg-gray-800/50 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span className="uppercase tracking-widest">Active Status: Verified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 shadow-sm p-8 hover:shadow-2xl hover:shadow-gray-500/5 transition-all">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Security Integrity</h3>
            <div className="space-y-6">
               <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                    <span className="text-gray-500">Identity Matrix Completion</span>
                    <span className="text-primary-500">85%</span>
                  </div>
                  <div className="h-2 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800">
                    <div className="h-full bg-primary-500 rounded-full shadow-sm" style={{ width: "85%" }}></div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Settings Area */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 shadow-sm min-h-[600px] hover:shadow-2xl hover:shadow-gray-500/5 transition-all duration-500">
            <div className="border-b border-gray-100 dark:border-gray-800">
              <nav className="flex px-8">
                {[
                  { id: "personal", label: "Core Data", icon: User },
                  { id: "security", label: "Access Matrix", icon: Lock },
                  { id: "notifications", label: "Alert Config", icon: Bell },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-3 px-6 py-5 text-[11px] font-black uppercase tracking-widest transition-all border-b-2",
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-500 bg-primary-500/5"
                        : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              {activeTab === "personal" && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Designation Name</label>
                      <input 
                        type="text" 
                        readOnly={!isEditing}
                        defaultValue={user?.name || "Agro Operator"}
                        className={cn(
                          "w-full px-5 py-4 rounded text-sm font-bold outline-none transition-all",
                          isEditing 
                            ? "bg-white dark:bg-gray-800 ring-4 ring-primary-500/5 border border-primary-500/20 text-gray-800 dark:text-white shadow-sm" 
                            : "bg-gray-50 dark:bg-gray-800/50 border border-transparent cursor-default text-gray-500 dark:text-gray-400"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact Protocol</label>
                      <input 
                        type="email" 
                        readOnly={!isEditing}
                        defaultValue={user?.email || "operator@agro-erp.enterprise"}
                        className={cn(
                          "w-full px-5 py-4 rounded text-sm font-bold outline-none transition-all",
                          isEditing 
                            ? "bg-white dark:bg-gray-800 ring-4 ring-primary-500/5 border border-primary-500/20 text-gray-800 dark:text-white shadow-sm" 
                            : "bg-gray-50 dark:bg-gray-800/50 border border-transparent cursor-default text-gray-500 dark:text-gray-400"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Satellite Connection</label>
                      <input 
                        type="text" 
                        readOnly={!isEditing}
                        placeholder="+880 1700 000000"
                        className={cn(
                          "w-full px-5 py-4 rounded text-sm font-bold outline-none transition-all",
                          isEditing 
                            ? "bg-white dark:bg-gray-800 ring-4 ring-primary-500/5 border border-primary-500/20 text-gray-800 dark:text-white shadow-sm" 
                            : "bg-gray-50 dark:bg-gray-800/50 border border-transparent cursor-default text-gray-500 dark:text-gray-400"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Geographic Node</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text" 
                          readOnly={!isEditing}
                          placeholder="Dhaka, Bangladesh"
                          className={cn(
                            "w-full pl-12 pr-5 py-4 rounded text-sm font-bold outline-none transition-all",
                            isEditing 
                              ? "bg-white dark:bg-gray-800 ring-4 ring-primary-500/5 border border-primary-500/20 text-gray-800 dark:text-white shadow-sm" 
                              : "bg-gray-50 dark:bg-gray-800/50 border border-transparent cursor-default text-gray-500 dark:text-gray-400"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational Notes</label>
                    <textarea 
                      rows={4}
                      readOnly={!isEditing}
                      placeholder="Specify mission objectives or personal bio..."
                      className={cn(
                        "w-full px-5 py-4 rounded text-sm font-bold outline-none transition-all resize-none",
                        isEditing 
                          ? "bg-white dark:bg-gray-800 ring-4 ring-primary-500/5 border border-primary-500/20 text-gray-800 dark:text-white shadow-sm" 
                          : "bg-gray-50 dark:bg-gray-800/50 border border-transparent cursor-default text-gray-500 dark:text-gray-400"
                      )}
                    ></textarea>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6 max-w-md">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Current Security Key</label>
                      <input 
                        type="password" 
                        readOnly={!isEditing}
                        placeholder={!isEditing ? "••••••••" : ""}
                        className={cn(
                          "w-full px-5 py-4 rounded text-sm font-bold outline-none transition-all",
                          isEditing 
                            ? "bg-white ring-4 ring-primary-500/5 border border-primary-500/20" 
                            : "bg-gray-50 dark:bg-gray-800/50 border border-transparent cursor-default"
                        )}
                      />
                    </div>
                    {isEditing && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">New Security Key</label>
                          <input 
                            type="password" 
                            className="w-full px-5 py-4 bg-white dark:bg-gray-800 ring-4 ring-primary-500/5 border border-primary-500/20 rounded text-sm font-bold outline-none shadow-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Verify Security Key</label>
                          <input 
                            type="password" 
                            className="w-full px-5 py-4 bg-white dark:bg-gray-800 ring-4 ring-primary-500/5 border border-primary-500/20 rounded text-sm font-bold outline-none shadow-sm"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-6 bg-primary-500/5 dark:bg-primary-500/10 rounded-md border border-primary-500/10 dark:border-primary-500/20 flex items-start gap-4">
                    <Info className="w-5 h-5 text-primary-500 mt-1" />
                    <div>
                       <p className="text-[12px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-tight">Encryption Standards</p>
                       <ul className="text-[10px] text-gray-500 dark:text-gray-400 mt-2 space-y-1 list-disc list-inside font-bold">
                         <li className="uppercase tracking-widest">Minimum 8 Alpha-numeric characters</li>
                         <li className="uppercase tracking-widest">Mandatory Special Character Matrix</li>
                         <li className="uppercase tracking-widest">Numerical Sequence Required</li>
                       </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                   {[
                     { label: "Dispatch Alerts", desc: "Receive real-time synchronization updates.", enabled: true },
                     { label: "Security Breach SMS", desc: "Immediate critical system alerts.", enabled: false },
                     { label: "System Reports", desc: "Stay informed with weekly analytics.", enabled: true }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-md border border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-all">
                        <div>
                           <h4 className="text-[13px] font-black text-gray-800 dark:text-white uppercase tracking-tight">{item.label}</h4>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{item.desc}</p>
                        </div>
                        <div 
                          onClick={() => isEditing && console.log("Toggle notification")}
                          className={cn(
                          "w-12 h-6 rounded-full p-1 transition-all relative flex items-center",
                          item.enabled ? "bg-primary-500" : "bg-gray-200 dark:bg-gray-700",
                          isEditing ? "cursor-pointer" : "cursor-default opacity-50"
                        )}>
                           <div className={cn(
                             "w-4 h-4 bg-white rounded-full shadow-lg transition-all",
                             item.enabled ? "translate-x-6" : "translate-x-0"
                           )}></div>
                        </div>
                     </div>
                   ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
