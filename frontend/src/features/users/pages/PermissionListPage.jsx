import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Key, 
  Edit2, 
  Trash2, 
  Loader2,
  Box,
  FolderOpen,
  ShieldCheck,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { permissionApi } from '../api/roleApi';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../../contexts/AuthContext';
import Swal from 'sweetalert2';


function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function PermissionListPage() {
  const { hasPermission } = useAuth();
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ 
    group: '', 
    sub_group: '', 
    actions: [], // Array for bulk creation
    manual_name: '',
    is_manual: false 
  });
  const [saving, setSaving] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [sidebarSearch, setSidebarSearch] = useState('');

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await permissionApi.getPermissions();
      if (response.status === 'Success') {
        const data = response.data || {};
        setPermissions(data);
        const initialExpanded = {};
        Object.keys(data).forEach(key => initialExpanded[key] = true);
        setExpandedGroups(initialExpanded);
      }
    } catch (error) {
      toast.error('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleOpenModal = (perm = null) => {
    if (perm) {
      setSelectedPermission(perm);
      const parts = perm.name.split('.');
      const hasDot = parts.length > 1;
      setFormData({ 
        group: perm.group, 
        sub_group: hasDot ? parts[0] : '', 
        actions: hasDot ? [parts[1]] : [],
        manual_name: perm.name,
        is_manual: !hasDot
      });
    } else {
      setSelectedPermission(null);
      setFormData({ 
        group: '', 
        sub_group: '', 
        actions: ['view', 'create', 'edit', 'delete'],
        manual_name: '', 
        is_manual: false 
      });
    }
    setIsModalOpen(true);
  };

  const toggleAction = (action) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.includes(action) 
        ? prev.actions.filter(a => a !== action)
        : [...prev.actions, action]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    let permissionsToSave = [];

    if (formData.is_manual) {
      if (!formData.manual_name.trim()) {
        toast.error('Invalid permission name');
        setSaving(false);
        return;
      }
      permissionsToSave.push({
        name: formData.manual_name.toLowerCase().trim(),
        group: formData.group.trim()
      });
    } else {
      if (!formData.sub_group.trim() || formData.actions.length === 0) {
        toast.error('Subgroup and at least one action are required');
        setSaving(false);
        return;
      }
      formData.actions.forEach(action => {
        permissionsToSave.push({
          name: `${formData.sub_group.toLowerCase().trim()}.${action.toLowerCase().trim()}`,
          group: formData.group.trim()
        });
      });
    }

    try {
      if (selectedPermission) {
        await permissionApi.updatePermission(selectedPermission.id, permissionsToSave[0]);
        toast.success('Permission updated successfully');
      } else {
        await permissionApi.createPermission({ permissions: permissionsToSave });
        toast.success(`${permissionsToSave.length} permissions created successfully`);
      }
      setIsModalOpen(false);
      fetchPermissions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will delete the permission and may affect existing roles!",
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
          await permissionApi.deletePermission(id);
          Swal.fire('Deleted!', 'Permission has been deleted.', 'success');
          fetchPermissions();
        } catch (error) {
          Swal.fire('Error!', 'Failed to delete permission.', 'error');
        }
      }
    });
  };

  const handleBulkDelete = async (type, value) => {
    const label = type === 'group' ? 'Main Group' : 'Sub Group';
    Swal.fire({
      title: `Delete entire ${label}?`,
      text: `This will permanently delete ALL permissions in "${value}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete all!',
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await permissionApi.bulkDeletePermissions(type, value);
          Swal.fire('Deleted!', 'Permissions have been deleted.', 'success');
          fetchPermissions();
        } catch (error) {
          Swal.fire('Error!', 'Failed to delete permissions.', 'error');
        }
      }
    });
  };

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const expandAll = () => {
    const allExpanded = {};
    Object.keys(permissions).forEach(key => allExpanded[key] = true);
    setExpandedGroups(allExpanded);
  };

  const collapseAll = () => {
    const allCollapsed = {};
    Object.keys(permissions).forEach(key => allCollapsed[key] = false);
    setExpandedGroups(allCollapsed);
  };

  const scrollToGroup = (groupId) => {
    const element = document.getElementById(`group-${groupId}`);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setExpandedGroups(prev => ({ ...prev, [groupId]: true }));
    }
  };

  const mainGroupList = Object.keys(permissions);
  const subGroupList = Array.from(new Set(
    Object.values(permissions).flatMap(sgs => Object.keys(sgs))
  ));
  const commonActions = ['view', 'create', 'edit', 'delete', 'manage', 'export', 'import'];

  const getActionColor = (action) => {
    const colors = {
      view: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
      create: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
      edit: 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
      delete: 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
      manage: 'text-purple-600 bg-purple-50 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
      export: 'text-cyan-600 bg-cyan-50 border-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20',
      import: 'text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
    };
    return colors[action.toLowerCase()] || 'text-gray-600 bg-gray-50 border-gray-100 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20';
  };

  const totalPerms = Object.values(permissions).reduce((acc, sub) => acc + Object.values(sub).flat().length, 0);
  const totalGroups = Object.keys(permissions).length;

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-10 min-h-screen">
      
      {/* Sidebar Navigation */}
      <aside className="lg:w-72 flex-shrink-0">
        <div className="sticky top-4 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Group Navigator</h4>
                    <span className="text-[10px] font-black bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{totalGroups}</span>
                </div>
                
                <div className="relative mb-4">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Filter groups..."
                        value={sidebarSearch}
                        onChange={(e) => setSidebarSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-md text-xs outline-none focus:ring-2 focus:ring-primary-500/10 transition-all"
                    />
                </div>

                <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.keys(permissions)
                        .filter(g => g.toLowerCase().includes(sidebarSearch.toLowerCase()))
                        .map(group => (
                        <button
                            key={group}
                            onClick={() => scrollToGroup(group)}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-[11px] font-bold text-gray-500 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:text-primary-600 transition-all text-left"
                        >
                            <span className="truncate pr-2">{group}</span>
                            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                        </button>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                    <button 
                        onClick={expandAll}
                        className="flex-1 py-2 text-[9px] font-black uppercase tracking-widest bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 text-gray-500 rounded transition-all"
                    >
                        Expand All
                    </button>
                    <button 
                        onClick={collapseAll}
                        className="flex-1 py-2 text-[9px] font-black uppercase tracking-widest bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 text-gray-500 rounded transition-all"
                    >
                        Collapse
                    </button>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-8 min-w-0">
        {/* Header & Main Search - Now Sticky & Integrated Search */}
        <div className="sticky top-4 z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-6 rounded-md border border-gray-100/50 dark:border-gray-800/50 shadow-xl shadow-gray-500/5 transition-all mb-8">
            <div className="space-y-1 flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-primary-500" />
                    </div>
                    <span className="text-[10px] font-extrabold text-primary-500 uppercase tracking-[0.2em]">Enterprise System</span>
                </div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">System Permissions</h1>
                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-none">Security & Access Management</p>
            </div>

            {/* Integrated Search Bar */}
            <div className="flex-1 max-w-lg mx-6 group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input 
                    type="text"
                    placeholder="Quick search across all matrices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-md text-xs font-bold outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all shadow-inner"
                />
            </div>
            
            <div className="flex items-center gap-6 flex-shrink-0">
                <div className="flex gap-6 pr-6 border-r border-gray-100 dark:border-gray-800">
                    <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Modules</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mt-1">{totalGroups}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mt-1">{totalPerms}</p>
                    </div>
                </div>
                {hasPermission('permission.manage') && (
                    <button 
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-3 px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-md shadow-2xl shadow-primary-500/20 transition-all active:scale-95 group"
                    >
                        <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                        Add Permission
                    </button>
                )}
            </div>
        </div>

        {/* Dynamic Matrix List */}
        <div className="space-y-6">
            {loading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-primary-500/10 border-t-primary-500 animate-spin"></div>
                    <ShieldCheck className="w-5 h-5 text-primary-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.3em]">Loading Permission Data...</p>
            </div>
            ) : (
            Object.entries(permissions).map(([group, subGroups]) => {
                const isExpanded = expandedGroups[group];
                const allGroupPerms = Object.values(subGroups).flat();
                const filteredGroupPerms = allGroupPerms.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                group.toLowerCase().includes(searchQuery.toLowerCase())
                );
                
                if (filteredGroupPerms.length === 0) return null;

                return (
                <div key={group} id={`group-${group}`} className="relative group/section transition-all">
                    {/* Group Header - Now Interactive */}
                    <div 
                        className={cn(
                            "flex items-center justify-between mb-2 p-3 rounded border transition-all cursor-pointer sticky top-[140px] z-10",
                            isExpanded 
                                ? "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm backdrop-blur-md" 
                                : "bg-gray-50/50 dark:bg-gray-800/30 border-transparent hover:border-gray-200"
                        )}
                        onClick={() => toggleGroup(group)}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-md flex items-center justify-center shadow-sm transition-all",
                                isExpanded ? "bg-primary-500 text-white" : "bg-white dark:bg-gray-900 text-gray-400 border border-gray-100 dark:border-gray-800"
                            )}>
                                {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest">{group}</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{filteredGroupPerms.length} Points Available</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {hasPermission('permission.manage') && (
                                <button 
                                onClick={(e) => { e.stopPropagation(); handleBulkDelete('group', group); }}
                                className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Collapsible Content */}
                    <div className={cn(
                        "transition-all duration-500 overflow-hidden",
                        isExpanded ? "max-h-[5000px] opacity-100 mt-6" : "max-h-0 opacity-0 pointer-events-none"
                    )}>
                        <div className="grid grid-cols-1 gap-8">
                            {Object.entries(subGroups).map(([subGroup, perms]) => {
                                const filteredPerms = perms.filter(p => 
                                p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                group.toLowerCase().includes(searchQuery.toLowerCase())
                                );
                                if (filteredPerms.length === 0) return null;

                                return (
                                <div key={subGroup} className="group/sub bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 p-8 shadow-sm hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-500">
                                    <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{subGroup}</h4>
                                    </div>
                                    {hasPermission('permission.manage') && (
                                        <button 
                                        onClick={() => handleBulkDelete('sub_group', subGroup)}
                                        className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md transition-all opacity-0 group-hover/sub:opacity-100"
                                        >
                                        <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {filteredPerms.map((perm) => {
                                        const [prefix, action] = perm.name.split('.');
                                        const displayAction = action || prefix;
                                        const displayModule = action ? prefix : '';

                                        return (
                                        <div key={perm.id} className="group/card relative bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded border border-transparent hover:border-primary-500/20 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 overflow-hidden">
                                            <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Key className="w-3.5 h-3.5 text-amber-500" />
                                                <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-all translate-x-4 group-hover/card:translate-x-0">
                                                <button 
                                                    onClick={() => handleOpenModal(perm)}
                                                    className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded transition-all"
                                                >
                                                    <Edit2 className="w-3 h-3" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(perm.id)}
                                                    className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded transition-all"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-1">
                                                {displayModule && (
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{displayModule}</p>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border transition-all",
                                                        getActionColor(displayAction)
                                                    )}>
                                                        {displayAction}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider pt-2 border-t border-gray-100 dark:border-gray-800/50">
                                                ID: {perm.name}
                                            </p>
                                            </div>
                                            <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-primary-500/5 blur-2xl group-hover/card:bg-primary-500/20 transition-all rounded-full"></div>
                                        </div>
                                        );
                                    })}
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                );
            })
            )}
        </div>
      </div>

      {/* Modal - Remains same as last turn */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-lg rounded-md shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20 dark:border-gray-800">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex flex-col">
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                  {selectedPermission ? 'Modify Point' : 'Deploy Module'}
                </h3>
                <span className="text-[10px] text-primary-500 font-black uppercase tracking-[0.2em]">RBAC Configuration</span>
              </div>
              {!selectedPermission && (
                <div className="flex items-center gap-3 px-3 py-1.5 bg-white dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Manual Mode</span>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, is_manual: !formData.is_manual })}
                    className={cn(
                      "w-9 h-4.5 rounded-full transition-all relative flex items-center",
                      formData.is_manual ? "bg-primary-500" : "bg-gray-200 dark:bg-gray-700"
                    )}
                  >
                    <div className={cn(
                      "w-3.5 h-3.5 rounded-full bg-white transition-all shadow-md",
                      formData.is_manual ? "translate-x-5" : "translate-x-0.5"
                    )}></div>
                  </button>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Main Group */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Box className="w-3.5 h-3.5 text-primary-500" /> Main Group / Domain
                </label>
                <input 
                  type="text"
                  required
                  list="main-group-list"
                  placeholder="e.g., User Management"
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded text-sm font-bold outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 shadow-sm"
                />
                <datalist id="main-group-list">
                  {mainGroupList.map(g => <option key={g} value={g} />)}
                </datalist>
              </div>

              {formData.is_manual ? (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Unique Identifier</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g., system_root_access"
                    value={formData.manual_name}
                    onChange={(e) => setFormData({ ...formData, manual_name: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded text-sm font-mono font-bold outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all dark:text-white"
                  />
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Module Prefix</label>
                    <input 
                      type="text"
                      required
                      list="sub-group-list"
                      placeholder="e.g., accounts"
                      value={formData.sub_group}
                      onChange={(e) => setFormData({ ...formData, sub_group: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded text-sm font-bold outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all dark:text-white font-medium"
                    />
                    <datalist id="sub-group-list">
                      {subGroupList.map(sg => <option key={sg} value={sg} />)}
                    </datalist>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action Matrix</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {commonActions.map(action => {
                        const isSelected = formData.actions.includes(action);
                        return (
                          <button
                            key={action}
                            type="button"
                            onClick={() => toggleAction(action)}
                            className={cn(
                              "px-3 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all border",
                              isSelected 
                                ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20" 
                                : "bg-white dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-gray-800 hover:border-primary-500/30 hover:text-primary-500"
                            )}
                          >
                            {action}
                          </button>
                        );
                      })}
                    </div>
                    
                    <div className="pt-2">
                      <input 
                        type="text"
                        placeholder="Type custom action + press enter..."
                        className="w-full px-4 py-2 bg-transparent border-b-2 border-gray-100 dark:border-gray-800 text-[11px] font-bold outline-none focus:border-primary-500 transition-colors dark:text-white"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = e.target.value.trim();
                            if (val && !formData.actions.includes(val)) {
                              toggleAction(val);
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="p-5 bg-primary-500/5 dark:bg-primary-500/10 border border-primary-500/10 dark:border-primary-500/20 rounded-2xl space-y-3">
                <p className="text-[9px] font-black text-primary-500 uppercase tracking-[0.3em]">Deployment Preview</p>
                <div className="flex flex-wrap gap-2">
                  {formData.is_manual ? (
                    <span className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-primary-500/20 rounded text-xs font-mono font-bold text-primary-600 dark:text-primary-400 shadow-sm">
                      {formData.manual_name || '...'}
                    </span>
                  ) : (
                    formData.actions.length > 0 ? (
                      formData.actions.map(action => (
                        <span key={action} className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-primary-500/20 rounded text-xs font-mono font-bold text-primary-600 dark:text-primary-400 shadow-sm">
                          {formData.sub_group || '...'}.{action}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic font-medium">No actions selected for deployment</span>
                    )
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  disabled={saving || (!formData.is_manual && formData.actions.length === 0)}
                  className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] bg-primary-500 hover:bg-primary-600 text-white rounded-2xl transition-all flex items-center gap-3 shadow-2xl shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {selectedPermission ? 'Save Deployment' : `Deploy ${formData.is_manual ? 1 : formData.actions.length} Points`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
