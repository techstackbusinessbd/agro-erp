import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { userApi } from "../api/userApi";
import { roleApi } from "../api/roleApi";
import { toast } from "react-hot-toast";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function UserModal({ isOpen, onClose, user, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    role: "Staff",
    is_active: true,
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingRoles, setFetchingRoles] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRoles = async () => {
      setFetchingRoles(true);
      try {
        const response = await roleApi.getRoles();
        if (response.status === "Success") {
          setRoles(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch roles");
      } finally {
        setFetchingRoles(false);
      }
    };

    if (isOpen) {
      fetchRoles();
      if (user) {
        setFormData({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          password: "",
          password_confirmation: "",
          role: user.role || "Staff",
          is_active: user.is_active ?? true,
        });
      } else {
        setFormData({
          name: "",
          username: "",
          email: "",
          phone: "",
          password: "",
          password_confirmation: "",
          role: "Staff",
          is_active: true,
        });
      }
      setErrors({});
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (user) {
        await userApi.updateUser(user.id, formData);
        toast.success("User updated successfully");
      } else {
        await userApi.createUser(formData);
        toast.success("User created successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-gray-900 w-full max-w-lg rounded-md shadow-2xl overflow-hidden animate-in zoom-in duration-200 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex flex-col">
            <h3 className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-tight">
              {user ? "Update User Details" : "Register Personnel"}
            </h3>
            <span className="text-[10px] text-primary-500 font-black uppercase tracking-[0.2em]">
              User Management
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-0.5">
                Full Name
              </label>
              <div className="relative group">
                <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={cn(
                    "w-full pl-9 pr-3 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-md text-sm outline-none focus:ring-4 transition-all dark:text-white focus:bg-white dark:focus:bg-gray-800",
                    errors.name
                      ? "border-rose-500 ring-rose-500/10"
                      : "focus:ring-primary-500/10 focus:border-primary-500",
                  )}
                  required
                />
              </div>
              {errors.name && (
                <p className="text-[10px] text-danger font-medium mt-0.5">
                  {errors.name[0]}
                </p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-0.5">
                Username
              </label>
              <div className="relative group">
                <Shield className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className={cn(
                    "w-full pl-9 pr-3 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-md text-sm outline-none focus:ring-4 transition-all dark:text-white focus:bg-white dark:focus:bg-gray-800",
                    errors.username
                      ? "border-rose-500 ring-rose-500/10"
                      : "focus:ring-primary-500/10 focus:border-primary-500",
                  )}
                  required
                />
              </div>
              {errors.username && (
                <p className="text-[10px] text-danger font-medium mt-0.5">
                  {errors.username[0]}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-0.5">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={cn(
                    "w-full pl-9 pr-3 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-md text-sm outline-none focus:ring-4 transition-all dark:text-white focus:bg-white dark:focus:bg-gray-800",
                    errors.email
                      ? "border-rose-500 ring-rose-500/10"
                      : "focus:ring-primary-500/10 focus:border-primary-500",
                  )}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-danger font-medium mt-0.5">
                  {errors.email[0]}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-0.5">
                Phone Number
              </label>
              <div className="relative group">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 1xxx-xxxxxx"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-md text-sm outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white focus:bg-white dark:focus:bg-gray-800"
                />
              </div>
            </div>

            {!user && (
              <>
                {/* Password */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-0.5">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={cn(
                        "w-full pl-9 pr-3 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-md text-sm outline-none focus:ring-4 transition-all dark:text-white focus:bg-white dark:focus:bg-gray-800",
                        errors.password
                          ? "border-rose-500 ring-rose-500/10"
                          : "focus:ring-primary-500/10 focus:border-primary-500",
                      )}
                      required
                    />
                  </div>
                  {errors.password && (
                    <p className="text-[10px] text-danger font-medium mt-0.5">
                      {errors.password[0]}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-0.5">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="password"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={cn(
                        "w-full pl-9 pr-3 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-md text-sm outline-none focus:ring-4 transition-all dark:text-white focus:bg-white dark:focus:bg-gray-800",
                        errors.password_confirmation
                          ? "border-rose-500 ring-rose-500/10"
                          : "focus:ring-primary-500/10 focus:border-primary-500",
                      )}
                      required
                    />
                  </div>
                  {errors.password_confirmation && (
                    <p className="text-[10px] text-danger font-medium mt-0.5">
                      {errors.password_confirmation[0]}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Role */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-0.5">
                User Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-md text-sm outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white appearance-none focus:bg-white dark:focus:bg-gray-800"
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg border border-gray-50 dark:border-gray-800">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-3.5 h-3.5 text-primary-500 border-gray-300 rounded focus:ring-primary-500 transition-all"
            />
            <label
              htmlFor="is_active"
              className="text-xs font-semibold text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              Active Account
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-[11px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95 border border-gray-100 dark:border-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 text-[11px] bg-primary-500 hover:bg-primary-600 text-white font-black uppercase tracking-widest rounded-md shadow-xl shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5" />
              )}
              {user ? "Save Changes" : "Save User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
