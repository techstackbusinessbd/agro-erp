import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  Key,
  Lock,
  ShieldCheck,
  Users,
  ChevronRight
} from "lucide-react";

import { userApi } from "../api/userApi";
import UserModal from "../components/UserModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import UserPermissionModal from "../components/UserPermissionModal";
import { toast } from "react-hot-toast";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";


function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function UserListPage() {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getUsers({ search, page });
      if (response.status === "Success") {
        const result = response.data;
        if (result && result.data && Array.isArray(result.data)) {
          setUsers(result.data);
          setMeta(result.meta || result);
        } else if (Array.isArray(result)) {
          setUsers(result);
          setMeta(null);
        } else {
          setUsers([]);
        }
      }
    } catch (error) {
      if (error.response?.status === 403) {
        window.location.href = '/unauthorized';
      } else {
        toast.error("Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleChangePassword = (user) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const handleManagePermissions = (user) => {
    setSelectedUser(user);
    setIsPermissionModalOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await userApi.deleteUser(id);
          Swal.fire(
            'Deleted!',
            'User has been deleted.',
            'success'
          );
          fetchUsers();
        } catch (error) {
          Swal.fire(
            'Error!',
            'Failed to delete user.',
            'error'
          );
        }
      }
    });
  };

  return (
    <div className="pb-10 min-h-screen space-y-8">
      
      {/* Premium Sticky Header with Integrated Search */}
      <div className="sticky top-4 z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-6 rounded-md border border-gray-100/50 dark:border-gray-800/50 shadow-xl shadow-gray-500/5 transition-all mb-8">
          <div className="space-y-1 shrink-0">
              <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary-500" />
                  </div>
                  <span className="text-[10px] font-extrabold text-primary-500 uppercase tracking-[0.2em]">Enterprise System</span>
              </div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Users Directory</h1>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">Identity & Access Management</p>
          </div>

          {/* Integrated Search Bar */}
          <div className="flex-1 max-w-lg mx-6 group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input 
                  type="text"
                  placeholder="Query user identity, role or status..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-md text-xs font-bold outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all shadow-inner"
              />
          </div>
          
          <div className="flex items-center gap-6 flex-shrink-0">
              <div className="flex gap-6 pr-6 border-r border-gray-100 dark:border-gray-800">
                  <div className="text-right">
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Users</p>
                      <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mt-1">{meta?.total || users.length}</p>
                  </div>
              </div>
              {hasPermission('users.create') && (
                  <button 
                      onClick={handleAddUser}
                      className="flex items-center gap-3 px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-md shadow-2xl shadow-primary-500/20 transition-all active:scale-95 group"
                  >
                      <UserPlus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                      Add User
                  </button>
              )}
          </div>
      </div>

      {/* Modern Users Table */}
      <div className="bg-white dark:bg-gray-900 rounded-md shadow-xl shadow-gray-500/5 border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  User Profile
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Contact Matrix
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Role & Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Onboarding
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">
                  Operations
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-50 dark:bg-gray-800 rounded w-1/6"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="group/row hover:bg-primary-500/[0.02] dark:hover:bg-primary-500/[0.05] transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-primary-500/20 transform transition-transform group-hover/row:scale-110">
                          {user.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-tight">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-primary-500 font-bold uppercase tracking-widest mt-0.5">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600 dark:text-gray-400">
                          <Mail className="w-3.5 h-3.5 text-primary-500/50" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 dark:text-gray-500">
                          <Phone className="w-3.5 h-3.5 text-gray-300" />
                          {user.phone || "---"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded text-[9px] font-black bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 uppercase tracking-widest border border-gray-200/50 dark:border-gray-700/50 w-fit">
                          {user.role || "Staff"}
                        </span>
                        {user.is_active ? (
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> 
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            Inactive
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
                         {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                       </p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-all translate-x-4 group-hover/row:translate-x-0">
                        {user.username !== 'superadmin' && (
                          <>
                            {hasPermission('permission.manage') && (
                              <button
                                onClick={() => handleManagePermissions(user)}
                                title="Manage Direct Permissions"
                                className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-md transition-all border border-transparent hover:border-amber-500/20"
                              >
                                <ShieldCheck className="w-4 h-4" />
                              </button>
                            )}
                            {hasPermission('users.edit') && (
                              <button
                                onClick={() => handleEditUser(user)}
                                title="Edit User Details"
                                className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-md transition-all border border-transparent hover:border-primary-500/20"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            {hasPermission('users.edit') && (
                              <button
                                onClick={() => handleChangePassword(user)}
                                title="Reset User Password"
                                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-600/10 rounded-md transition-all border border-transparent hover:border-amber-600/20"
                              >
                                <Lock className="w-4 h-4" />
                              </button>
                            )}
                            {hasPermission('users.delete') && (
                              <button
                                onClick={() => handleDelete(user.id)}
                                title="Delete User"
                                className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md transition-all border border-transparent hover:border-rose-500/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-32 text-center bg-gray-50/30 dark:bg-gray-800/10">
                    <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
                      <div className="w-20 h-20 rounded-md bg-white dark:bg-gray-900 flex items-center justify-center border border-gray-100 dark:border-gray-800 shadow-2xl shadow-primary-500/5 rotate-3 hover:rotate-0 transition-transform">
                        <Users className="w-10 h-10 text-primary-500/20" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-tight">No Users Found</h4>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">We couldn't find any personnel matching your search criteria. Try a different query.</p>
                      </div>
                      <button 
                        onClick={() => setSearch("")}
                        className="px-6 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest rounded-md hover:bg-gray-50 transition-all shadow-sm"
                      >
                        Reset Search
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Premium Pagination */}
        {meta && (
          <div className="px-6 py-6 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all">
            <div className="flex items-center gap-4">
               <div className="flex -space-x-2">
                 {users.slice(0, 3).map((u, i) => (
                   <div key={i} className="w-8 h-8 rounded border-2 border-white dark:border-gray-900 bg-primary-500 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                     {u.name?.charAt(0)}
                   </div>
                 ))}
               </div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Showing <span className="text-gray-800 dark:text-white">{users.length}</span> of <span className="text-gray-800 dark:text-white">{meta.total}</span> Users
               </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm active:scale-95"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                 <span className="w-8 h-8 flex items-center justify-center rounded bg-primary-500 text-white text-[10px] font-black shadow-lg shadow-primary-500/20">{page}</span>
                 <span className="text-[10px] font-black text-gray-300 mx-1">/</span>
                 <span className="text-[10px] font-black text-gray-400">{meta.last_page}</span>
              </div>
              <button
                disabled={page === meta.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white bg-primary-500 rounded-md hover:bg-primary-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-lg shadow-primary-500/20 active:scale-95"
              >
                Next Phase
              </button>
            </div>
          </div>
        )}
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSuccess={fetchUsers}
      />

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        user={selectedUser}
      />

      <UserPermissionModal 
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
