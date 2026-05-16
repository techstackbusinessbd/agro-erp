import React, { useState, useEffect } from 'react';
import { 
  X, 
  Shield, 
  Check,
  Save,
  Loader2,
  Lock,
  Search,
  Users,
  ShieldCheck,
  Key,
  Building2,
  Building,
  Menu,
  Settings,
  Package,
  Box,
  Layout,
  UserCircle,
  CreditCard,
  BarChart3
} from 'lucide-react';
import { roleApi, permissionApi } from '../api/roleApi';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const formatPermissionLabel = (name) => {
  if (!name) return '';
  const parts = name.split('.');
  if (parts.length === 1) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  const [module, action] = parts;
  
  // Singularize logic
  let singularModule = module;
  if (module.endsWith('ies')) {
    singularModule = module.slice(0, -3) + 'y';
  } else if (module.endsWith('s') && !module.endsWith('ss')) {
    singularModule = module.slice(0, -1);
  }

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  
  return `${capitalize(singularModule)} ${capitalize(action)}`;
};

const getGroupIcon = (group) => {
  const g = group.toLowerCase();
  if (g.includes('user')) return <Users className="w-3.5 h-3.5 text-primary-500" />;
  if (g.includes('role')) return <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />;
  if (g.includes('permission')) return <Key className="w-3.5 h-3.5 text-amber-500" />;
  if (g.includes('branch')) return <Building2 className="w-3.5 h-3.5 text-blue-500" />;
  if (g.includes('company')) return <Building className="w-3.5 h-3.5 text-indigo-500" />;
  if (g.includes('menu')) return <Menu className="w-3.5 h-3.5 text-rose-500" />;
  if (g.includes('setting')) return <Settings className="w-3.5 h-3.5 text-gray-500" />;
  if (g.includes('product') || g.includes('item')) return <Package className="w-3.5 h-3.5 text-orange-500" />;
  if (g.includes('sale')) return <CreditCard className="w-3.5 h-3.5 text-green-500" />;
  if (g.includes('report')) return <BarChart3 className="w-3.5 h-3.5 text-purple-500" />;
  return <Box className="w-3.5 h-3.5 text-gray-400" />;
};

export default function RoleModal({ isOpen, onClose, role, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    permissions: []
  });
  const [allPermissions, setAllPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingPerms, setFetchingPerms] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAllPermissions = async () => {
      setFetchingPerms(true);
      try {
        const response = await permissionApi.getPermissions();
        if (response.status === 'Success') {
          setAllPermissions(response.data || {});
        }
      } catch (error) {
        toast.error('Failed to load permissions list');
      } finally {
        setFetchingPerms(false);
      }
    };

    if (isOpen) {
      fetchAllPermissions();
      if (role) {
        setFormData({
          name: role.name || '',
          permissions: (role.permissions || []).map(p => p.name)
        });
      } else {
        setFormData({
          name: '',
          permissions: []
        });
      }
      setErrors({});
    }
  }, [role, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (role) {
        await roleApi.updateRole(role.id, formData);
        toast.success('Role updated successfully');
      } else {
        await roleApi.createRole(formData);
        toast.success('Role created successfully');
      }
      onSuccess();
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

  const handleTogglePermission = (permName) => {
    setFormData(prev => {
      const isSelected = prev.permissions.includes(permName);
      if (isSelected) {
        return { ...prev, permissions: prev.permissions.filter(p => p !== permName) };
      } else {
        return { ...prev, permissions: [...prev.permissions, permName] };
      }
    });
  };

  const handleToggleGroup = (groupName, perms) => {
    const groupPermNames = perms.map(p => p.name);
    const allSelected = groupPermNames.every(name => formData.permissions.includes(name));

    setFormData(prev => {
      if (allSelected) {
        // Deselect all in group
        return {
          ...prev,
          permissions: prev.permissions.filter(name => !groupPermNames.includes(name))
        };
      } else {
        // Select all in group (keeping existing ones from other groups)
        const uniquePerms = Array.from(new Set([...prev.permissions, ...groupPermNames]));
        return {
          ...prev,
          permissions: uniquePerms
        };
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-4xl rounded-md shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh] border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-500" />
            <h3 className="text-base font-bold text-gray-800 dark:text-white">
              {role ? `Edit Role: ${role.name}` : 'Create New Role'}
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 space-y-6 flex-1 overflow-y-auto">
            {/* Role Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-0.5">Role Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Manager, Editor"
                className={cn(
                  "w-full px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-md text-sm outline-none focus:ring-4 transition-all dark:text-white focus:bg-white dark:focus:bg-gray-800",
                  errors.name ? "border-rose-500 ring-rose-500/10" : "focus:ring-primary-500/10 focus:border-primary-500"
                )}
                required
              />
              {errors.name && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.name[0]}</p>}
            </div>

            {/* Permissions Matrix */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-0.5">Access Control Matrix</label>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Define permissions for each system module.</p>
                </div>
                <div className="relative">
                  <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search permissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-md text-[11px] outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 w-48"
                  />
                </div>
              </div>

              {fetchingPerms ? (
                <div className="py-20 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                  <span className="text-xs text-gray-400 font-medium">Preparing matrix...</span>
                </div>
              ) : (
                <div className="space-y-6 pb-4">
                  {Object.entries(allPermissions).map(([group, subGroups]) => {
                    return (
                      <div key={group} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
                        <div className="px-5 py-3 bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1 bg-primary-500/10 rounded">
                              {getGroupIcon(group)}
                            </div>
                            <h4 className="text-xs font-extrabold text-gray-700 dark:text-gray-200 uppercase tracking-wider">{group}</h4>
                          </div>
                        </div>
                        
                        <div className="p-5 space-y-6">
                          {Object.entries(subGroups).map(([subGroup, perms]) => {
                            const filteredGroupPerms = perms.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
                            if (filteredGroupPerms.length === 0) return null;

                            const allGroupSelected = filteredGroupPerms.every(p => formData.permissions.includes(p.name));

                            return (
                              <div key={subGroup} className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-primary-500/40"></div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{subGroup}</span>
                                  </div>
                                  <label className="flex items-center gap-2 cursor-pointer group/label">
                                    <span className="text-[9px] font-bold text-gray-400 group-hover/label:text-primary-500 uppercase transition-colors">Select All</span>
                                    <input 
                                        type="checkbox"
                                        checked={allGroupSelected}
                                        onChange={() => handleToggleGroup(subGroup, filteredGroupPerms)}
                                        className="w-3 h-3 rounded border-gray-300 text-primary-500 focus:ring-primary-500/10"
                                    />
                                  </label>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                  {filteredGroupPerms.map((perm) => {
                                    const isSelected = formData.permissions.includes(perm.name);
                                    return (
                                      <div 
                                        key={perm.id}
                                        onClick={() => handleTogglePermission(perm.name)}
                                        className={cn(
                                          "flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all border",
                                          isSelected 
                                            ? "bg-primary-50/50 dark:bg-primary-500/5 border-primary-100 dark:border-primary-500/20 shadow-sm" 
                                            : "border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        )}
                                      >
                                        <div className={cn(
                                          "w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0",
                                          "w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0",
                                          isSelected ? "bg-primary-500 border-primary-500" : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                                        )}>
                                          {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest truncate">
                                                {perm.name.split('.')[1] || perm.name}
                                            </p>
                                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter opacity-60 truncate">{perm.name}</p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="px-5 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-8 py-3 text-[11px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95 border border-gray-100 dark:border-gray-800"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-10 py-3 text-[11px] bg-primary-500 hover:bg-primary-600 text-white font-black uppercase tracking-widest rounded-md shadow-xl shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {role ? 'Update Role' : 'Save Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

