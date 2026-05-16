import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  CheckCircle,
  Loader2,
  Lock
} from 'lucide-react';
import { userApi } from '../api/userApi';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function ChangePasswordModal({ isOpen, onClose, user }) {
  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        password: '',
        password_confirmation: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await userApi.updateUser(user.id, formData);
      toast.success('Password updated successfully');
      onClose();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary-500" />
            <h3 className="text-base font-bold text-gray-800 dark:text-white">Change Password</h3>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 bg-primary-500/5 border-b border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Updating password for <span className="font-bold text-primary-500">{user?.name}</span> (@{user?.username})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Password */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-0.5">New Password</label>
            <div className="relative group">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={cn(
                  "w-full pl-9 pr-4 py-2 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-lg text-sm outline-none focus:ring-2 transition-all dark:text-white focus:bg-white dark:focus:bg-gray-800",
                  errors.password ? "border-danger ring-danger/10" : "focus:ring-primary-500/10 focus:border-primary-500"
                )}
                required
                autoFocus
              />
            </div>
            {errors.password && <p className="text-[10px] text-danger font-medium mt-0.5">{errors.password[0]}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-0.5">Confirm New Password</label>
            <div className="relative group">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="password" 
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white focus:bg-white dark:focus:bg-gray-800"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2 text-sm text-gray-600 dark:text-gray-400 font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg shadow-md shadow-primary-500/10 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
