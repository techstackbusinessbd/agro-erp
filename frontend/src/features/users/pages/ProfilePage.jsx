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
    // Simulate API call
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Saving changes...',
        success: <b>Profile updated successfully!</b>,
        error: <b>Could not save changes.</b>,
      }
    ).then(() => {
      setIsEditing(false);
    });
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Any unsaved changes will be lost!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#f43f5e",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep editing",
      background: "#fff",
      borderRadius: "15px",
      customClass: {
        title: "text-lg font-bold text-gray-800",
        htmlContainer: "text-sm text-gray-500",
        confirmButton: "px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-500/20",
        cancelButton: "px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-rose-500/20"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setIsEditing(false);
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
          <p className="text-sm text-gray-400">Manage your account settings and preferences.</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={toggleEdit}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            <Edit2 className="w-4 h-4 text-primary-500" />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-3">
             <button 
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-95"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar Info */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="card border-none ring-1 ring-gray-100 shadow-sm overflow-hidden">
            <div className="h-24 bg-primary-500"></div>
            <div className="p-6 pt-0 -mt-12 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                  <div className="w-full h-full rounded-full bg-primary-50 flex items-center justify-center overflow-hidden border-2 border-white">
                    <span className="text-3xl font-bold text-primary-500">
                      {user?.name?.charAt(0) || "A"}
                    </span>
                  </div>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-primary-500 transition-colors border border-gray-100 animate-in zoom-in duration-200">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <h2 className="mt-4 text-lg font-bold text-gray-800">{user?.name || "Agro User"}</h2>
              <p className="text-sm text-gray-400 font-medium">{user?.role || "System Administrator"}</p>
              
              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-500 p-2 rounded-lg bg-gray-50/50">
                  <Mail className="w-4 h-4 text-primary-500" />
                  <span>{user?.email || "admin@agroerp.com"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 p-2 rounded-lg bg-gray-50/50">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>Verified Account</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-none ring-1 ring-gray-100 shadow-sm p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Account Status</h3>
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-gray-400">Profile Completion</span>
                    <span className="text-primary-500">85%</span>
                  </div>
                  <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: "85%" }}></div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Settings Area */}
        <div className="col-span-12 lg:col-span-8">
          <div className="card border-none ring-1 ring-gray-100 shadow-sm min-h-[500px]">
            <div className="border-b border-gray-100">
              <nav className="flex px-6">
                {[
                  { id: "personal", label: "Personal Info", icon: User },
                  { id: "security", label: "Security", icon: Lock },
                  { id: "notifications", label: "Notifications", icon: Bell },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-4 text-sm font-bold transition-all border-b-2",
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-500"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "personal" && (
                <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                      <input 
                        type="text" 
                        readOnly={!isEditing}
                        defaultValue={user?.name || "Agro User"}
                        className={cn(
                          "w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all",
                          isEditing 
                            ? "bg-white ring-1 ring-primary-500/20 focus:ring-primary-500/40 shadow-sm" 
                            : "bg-gray-50 border-none cursor-default"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        readOnly={!isEditing}
                        defaultValue={user?.email || "admin@agroerp.com"}
                        className={cn(
                          "w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all",
                          isEditing 
                            ? "bg-white ring-1 ring-primary-500/20 focus:ring-primary-500/40 shadow-sm" 
                            : "bg-gray-50 border-none cursor-default"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                      <input 
                        type="text" 
                        readOnly={!isEditing}
                        placeholder="+880 1234 567890"
                        className={cn(
                          "w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all",
                          isEditing 
                            ? "bg-white ring-1 ring-primary-500/20 focus:ring-primary-500/40 shadow-sm" 
                            : "bg-gray-50 border-none cursor-default"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text" 
                          readOnly={!isEditing}
                          placeholder="Dhaka, Bangladesh"
                          className={cn(
                            "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all",
                            isEditing 
                              ? "bg-white ring-1 ring-primary-500/20 focus:ring-primary-500/40 shadow-sm" 
                              : "bg-gray-50 border-none cursor-default"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bio / Notes</label>
                    <textarea 
                      rows={4}
                      readOnly={!isEditing}
                      placeholder="Tell us about yourself..."
                      className={cn(
                        "w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all resize-none",
                        isEditing 
                          ? "bg-white ring-1 ring-primary-500/20 focus:ring-primary-500/40 shadow-sm" 
                          : "bg-gray-50 border-none cursor-default"
                      )}
                    ></textarea>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Password</label>
                      <input 
                        type="password" 
                        readOnly={!isEditing}
                        placeholder={!isEditing ? "••••••••" : ""}
                        className={cn(
                          "w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all",
                          isEditing 
                            ? "bg-white ring-1 ring-primary-500/20 focus:ring-primary-500/40 shadow-sm" 
                            : "bg-gray-50 border-none cursor-default"
                        )}
                      />
                    </div>
                    {isEditing && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>
                          <input 
                            type="password" 
                            className="w-full px-4 py-2.5 bg-white ring-1 ring-primary-500/20 focus:ring-primary-500/40 rounded-xl text-sm outline-none transition-all shadow-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm New Password</label>
                          <input 
                            type="password" 
                            className="w-full px-4 py-2.5 bg-white ring-1 ring-primary-500/20 focus:ring-primary-500/40 rounded-xl text-sm outline-none transition-all shadow-sm"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-4 bg-primary-50 rounded-xl border border-primary-100 flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary-500 mt-0.5" />
                    <div>
                       <p className="text-sm font-bold text-primary-700">Password Requirements</p>
                       <ul className="text-xs text-primary-600 mt-1 list-disc list-inside">
                         <li>At least 8 characters long</li>
                         <li>Must contain at least one special character</li>
                         <li>Must contain at least one number</li>
                       </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                   {[
                     { label: "Email Notifications", desc: "Receive email updates about your account activity.", enabled: true },
                     { label: "SMS Alerts", desc: "Get text messages for critical system alerts.", enabled: false },
                     { label: "Marketing Emails", desc: "Stay up to date with new features and offers.", enabled: true }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                        <div>
                           <h4 className="text-sm font-bold text-gray-700">{item.label}</h4>
                           <p className="text-xs text-gray-400">{item.desc}</p>
                        </div>
                        <div className={cn(
                          "w-10 h-6 rounded-full p-1 transition-all",
                          item.enabled ? "bg-primary-500" : "bg-gray-300",
                          isEditing ? "cursor-pointer" : "cursor-default opacity-60"
                        )}>
                           <div className={cn(
                             "w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                             item.enabled ? "ml-4" : "ml-0"
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
