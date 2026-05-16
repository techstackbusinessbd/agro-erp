import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Key, 
  Shield, 
  Loader2,
  CheckCircle,
  AlertCircle,
  FolderOpen
} from 'lucide-react';
import { userApi } from '../api/userApi';
import { permissionApi } from '../api/roleApi';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function UserPermissionModal({ isOpen, onClose, user, onSuccess }) {
  const [allPermissions, setAllPermissions] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]); // Permissions from the user's role
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setFetchingData(true);
      try {
        const [permResponse, userPermResponse] = await Promise.all([
          permissionApi.getPermissions(),
          userApi.getUserPermissions(user.id)
        ]);

        if (permResponse.status === 'Success') {
          setAllPermissions(permResponse.data || {});
        }
        if (userPermResponse.status === 'Success') {
          setSelectedPermissions(userPermResponse.data.direct_permissions || []);
          setRolePermissions(userPermResponse.data.all_permissions || []);
        }
      } catch (error) {
        toast.error('Failed to load permissions');
      } finally {
        setFetchingData(false);
      }
    };

    if (isOpen && user) {
      fetchData();
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleTogglePermission = (permName) => {
    if (selectedPermissions.includes(permName)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permName));
    } else {
      setSelectedPermissions([...selectedPermissions, permName]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userApi.syncUserPermissions(user.id, selectedPermissions);
      toast.success('User permissions updated successfully');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update permissions');
    } finally {
      setLoading(false);
    }
  };

  const getGroupIcon = (group) => {
    const g = group.toLowerCase();
    if (g.includes('user')) return <Shield className="w-3.5 h-3.5 text-primary-500" />;
    if (g.includes('role')) return <Key className="w-3.5 h-3.5 text-amber-500" />;
    if (g.includes('setting')) return <Shield className="w-3.5 h-3.5 text-purple-500" />;
    return <FolderOpen className="w-3.5 h-3.5 text-gray-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Custom Permissions for {user?.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Manage individual permissions in addition to role permissions.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="text"
                placeholder="Search permissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white"
              />
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg p-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                Permissions inherited from the role are visible but can't be untoggled here.
              </p>
            </div>
          </div>

          {fetchingData ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              <p className="text-sm text-gray-400 font-medium">Loading permission matrix...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {Object.entries(allPermissions).map(([group, subGroups]) => {
                return (
                  <div key={group} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                    {/* Main Group Header */}
                    <div className="px-5 py-3 bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2.5">
                      <div className="p-1.5 bg-primary-500/10 rounded-lg">
                        {getGroupIcon(group)}
                      </div>
                      <h4 className="text-sm font-extrabold text-gray-700 dark:text-gray-200 uppercase tracking-widest">{group}</h4>
                    </div>
                    
                    {/* Sub Groups Container */}
                    <div className="p-5 space-y-6">
                      {Object.entries(subGroups).map(([subGroup, perms]) => {
                        const filteredPerms = perms.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
                        if (filteredPerms.length === 0) return null;

                        return (
                          <div key={subGroup} className="space-y-3">
                            {/* Sub Group Label */}
                            <div className="flex items-center gap-2 mb-2 px-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-500/40"></div>
                              <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{subGroup}</h5>
                              <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700/50"></div>
                            </div>

                            {/* Permissions Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              {filteredPerms.map((perm) => {
                                const isFromRole = rolePermissions.includes(perm.name) && !selectedPermissions.includes(perm.name);
                                const isSelected = selectedPermissions.includes(perm.name) || rolePermissions.includes(perm.name);
                                const isDirect = selectedPermissions.includes(perm.name);

                                return (
                                  <div 
                                    key={perm.id}
                                    onClick={() => !rolePermissions.includes(perm.name) && handleTogglePermission(perm.name)}
                                    className={cn(
                                      "relative flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer group",
                                      isSelected 
                                        ? "bg-primary-500/5 border-primary-500/20 shadow-sm" 
                                        : "bg-gray-50/30 dark:bg-gray-800/50 border-gray-50 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600",
                                      rolePermissions.includes(perm.name) && "cursor-default opacity-80"
                                    )}
                                  >
                                    <div className={cn(
                                      "w-4 h-4 rounded border flex items-center justify-center transition-all",
                                      isSelected ? "bg-primary-500 border-primary-500" : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                                    )}>
                                      {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                                    </div>
                                    <div className="flex-1">
                                      <p className={cn(
                                        "text-[12px] font-bold leading-none mb-1",
                                        isSelected ? "text-primary-600 dark:text-primary-400" : "text-gray-600 dark:text-gray-400"
                                      )}>
                                        {perm.name.split('.')[1]?.toUpperCase() || perm.name}
                                      </p>
                                      <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{perm.name}</p>
                                    </div>
                                    {isDirect && (
                                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                                      </span>
                                    )}
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

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2 text-sm text-gray-600 dark:text-gray-400 font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            Cancel
          </button>
          <button 
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="px-8 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg shadow-md shadow-primary-500/10 transition-all active:scale-95 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Custom Permissions
          </button>
        </div>
      </div>
    </div>
  );
}
