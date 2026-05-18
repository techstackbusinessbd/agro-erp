import React, { useState, useEffect } from 'react';
import { 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
} from 'recharts';
import { 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    Navigation,
    Cpu,
    Plus,
    Users as UsersIcon,
    Briefcase,
    LayoutDashboard as LayoutDashboardIcon,
    Package,
    Warehouse,
    Truck,
    ShieldCheck,
    Loader2,
    Settings,
    UserCheck,
    TrendingUp
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import apiClient from '../../../services/apiClient';
import toast from 'react-hot-toast';

export default function DashboardOverview() {
    const { user, hasPermission } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/core/dashboard-stats');
            if (response.data?.status === 'Success' || response.data?.data) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats', error);
            toast.error('Failed to load live dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                <span className="font-extrabold text-sm text-gray-500 uppercase tracking-widest">Loading Live ERP Intelligence...</span>
            </div>
        );
    }

    // Default safe state
    const data = stats || {
        products_count: 0,
        variants_count: 0,
        categories_count: 0,
        uoms_count: 0,
        warehouses_count: 0,
        depots_count: 0,
        territories_count: 0,
        transfers_count: 0,
        transit_count: 0,
        audit_logs_count: 0,
        users_count: 0,
        roles_count: 0
    };

    // Recharts Data Configuration
    const catalogPieData = [
        { name: 'Products', value: data.products_count, color: '#10b981' },
        { name: 'Variants', value: data.variants_count, color: '#3b82f6' },
        { name: 'Categories', value: data.categories_count, color: '#f59e0b' }
    ].filter(item => item.value > 0);

    // If empty, supply placeholder to render
    if (catalogPieData.length === 0) {
        catalogPieData.push({ name: 'Active Catalog', value: 1, color: '#10b981' });
    }

    const networkBarData = [
        { name: 'Warehouses', count: data.warehouses_count },
        { name: 'Depots', count: data.depots_count },
        { name: 'Territories', count: data.territories_count },
        { name: 'Logistics STO', count: data.transfers_count }
    ];

    return (
        <div className="pb-10 min-h-screen space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Premium Sticky Page Header */}
            <div className="sticky top-4 z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-6 rounded-md border border-gray-100/50 dark:border-gray-800/50 shadow-xl shadow-gray-500/5 transition-all mb-8">
                <div className="space-y-1 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
                            <LayoutDashboardIcon className="w-5 h-5 text-primary-500" />
                        </div>
                        <span className="text-[10px] font-extrabold text-primary-500 uppercase tracking-[0.2em]">Agro ERP Enterprise</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Operations Dashboard</h1>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">Yield Analytics & Supply Chain</p>
                </div>
                
                <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Active User Role</p>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 shadow-sm">
                            <UserCheck className="w-3.5 h-3.5" />
                            {user?.role_name || 'Operations Officer'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Stats Row - Permission Protected Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. Master Catalog Stats (products.view) */}
                {hasPermission('products.view') && (
                    <div className="group/card relative bg-white dark:bg-gray-900 rounded-md p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-500/10 rounded flex items-center justify-center">
                                <Package className="w-5 h-5 text-emerald-500" />
                            </div>
                            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-500/5 px-2 py-0.5 rounded uppercase tracking-wider">Catalog</span>
                        </div>
                        <h3 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-1">Products Catalog</h3>
                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mt-1">{data.products_count} Items</p>
                        <p className="text-[10px] font-bold text-gray-450 dark:text-gray-400 mt-2 block">{data.variants_count} Active Pack Configurations</p>
                        <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-500 w-0 group-hover/card:w-full rounded-b-md"></div>
                    </div>
                )}

                {/* 2. Warehouse Stock Stats (warehouses.view) */}
                {hasPermission('warehouses.view') && (
                    <div className="group/card relative bg-white dark:bg-gray-900 rounded-md p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/10 rounded flex items-center justify-center">
                                <Warehouse className="w-5 h-5 text-blue-500" />
                            </div>
                            <span className="text-[10px] font-extrabold text-blue-600 bg-blue-500/5 px-2 py-0.5 rounded uppercase tracking-wider">Network</span>
                        </div>
                        <h3 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-1">Active Warehouses</h3>
                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mt-1">{data.warehouses_count} Hubs</p>
                        <p className="text-[10px] font-bold text-gray-450 dark:text-gray-400 mt-2 block">{data.depots_count} Registered Regional Depots</p>
                        <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-500 w-0 group-hover/card:w-full rounded-b-md"></div>
                    </div>
                )}

                {/* 3. Logistics Pipelines (transfers.view or warehouses.view) */}
                {(hasPermission('warehouses.view') || hasPermission('transfers.view')) && (
                    <div className="group/card relative bg-white dark:bg-gray-900 rounded-md p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-amber-500/10 rounded flex items-center justify-center">
                                <Truck className="w-5 h-5 text-amber-500" />
                            </div>
                            <span className="text-[10px] font-extrabold text-amber-600 bg-amber-500/5 px-2 py-0.5 rounded uppercase tracking-wider">Logistics</span>
                        </div>
                        <h3 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-1">Transfer Orders (STO)</h3>
                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mt-1">{data.transfers_count} Orders</p>
                        <p className="text-[10px] font-bold text-amber-500 mt-2 block flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 animate-pulse" />
                            {data.transit_count} Ships Active in Transit
                        </p>
                        <div className="absolute bottom-0 left-0 h-1 bg-amber-500 transition-all duration-500 w-0 group-hover/card:w-full rounded-b-md"></div>
                    </div>
                )}

                {/* 4. Security Auditing (users.view) */}
                {hasPermission('users.view') && (
                    <div className="group/card relative bg-white dark:bg-gray-900 rounded-md p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-500/10 rounded flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-purple-500" />
                            </div>
                            <span className="text-[10px] font-extrabold text-purple-600 bg-purple-500/5 px-2 py-0.5 rounded uppercase tracking-wider">Security</span>
                        </div>
                        <h3 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-1">Compliance Ledger</h3>
                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mt-1">{data.audit_logs_count} Entries</p>
                        <p className="text-[10px] font-bold text-gray-450 dark:text-gray-400 mt-2 block">{data.users_count} Users with {data.roles_count} Roles Checked</p>
                        <div className="absolute bottom-0 left-0 h-1 bg-purple-500 transition-all duration-500 w-0 group-hover/card:w-full rounded-b-md"></div>
                    </div>
                )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Inventory Status & Product Catalog Chart */}
                {hasPermission('products.view') ? (
                    <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col justify-between">
                        <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800/50 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/20">
                            <h3 className="text-[12px] font-black text-gray-800 dark:text-white uppercase tracking-widest">Catalog Composition</h3>
                        </div>
                        <div className="p-6 h-[340px] relative flex flex-col justify-between">
                            <ResponsiveContainer width="100%" height="80%" minWidth={0} minHeight={0}>
                                <PieChart>
                                    <Pie
                                        data={catalogPieData}
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={450}
                                    >
                                        {catalogPieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            
                            {/* Value in Middle */}
                            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                <span className="text-3xl font-black text-gray-800 dark:text-white tracking-tighter">{data.products_count + data.variants_count}</span>
                                <span className="text-[9px] text-gray-400 font-extrabold uppercase block leading-none">Total SKU</span>
                            </div>

                            <div className="flex justify-center gap-4 mt-4">
                                {catalogPieData.map((item, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-[10px] font-black text-gray-800 dark:text-gray-300 uppercase tracking-widest">{item.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex flex-col items-center justify-center text-center">
                        <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
                        <h4 className="font-extrabold text-sm text-gray-400 uppercase tracking-wider">Catalog Access Restricted</h4>
                        <p className="text-xs text-gray-400 mt-1 max-w-[200px]">You need products.view permission to view catalog insights.</p>
                    </div>
                )}

                {/* 2. Warehouse & Depot Distribution Chart */}
                {hasPermission('warehouses.view') ? (
                    <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 shadow-sm lg:col-span-2 overflow-hidden flex flex-col justify-between">
                        <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800/50 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/20">
                            <h3 className="text-[12px] font-black text-gray-800 dark:text-white uppercase tracking-widest">Network & Logistics Channels</h3>
                        </div>
                        <div className="p-6 h-[340px]">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <BarChart data={networkBarData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                                        cursor={{ fill: '#f8fafc', opacity: 0.5 }}
                                    />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 shadow-sm p-6 lg:col-span-2 flex flex-col items-center justify-center text-center">
                        <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
                        <h4 className="font-extrabold text-sm text-gray-400 uppercase tracking-wider">Logistics Network Access Restricted</h4>
                        <p className="text-xs text-gray-400 mt-1 max-w-[300px]">You need warehouses.view permission to view warehouses, depots, and transfer channels.</p>
                    </div>
                )}
            </div>

            {/* Bottom Row - Operations Summary & Quick Links */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Quick Info / Welcome Box */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-md border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between hover:shadow-xl hover:shadow-gray-500/5 transition-all">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded bg-primary-500/10 text-primary-500 flex items-center justify-center shadow-inner">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-1">Agro Operations</h4>
                            <p className="text-xl font-black text-gray-800 dark:text-white tracking-tight">Active & Synchronized</p>
                        </div>
                    </div>
                </div>

                {/* 2. Registered Users Count */}
                {hasPermission('users.view') && (
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-md border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between hover:shadow-xl hover:shadow-gray-500/5 transition-all">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner">
                                <UsersIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-1">ERP Directives</h4>
                                <p className="text-xl font-black text-gray-800 dark:text-white tracking-tight">{data.users_count} Registered Officers</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Settings Status */}
                {hasPermission('settings.manage') && (
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-md border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between hover:shadow-xl hover:shadow-gray-500/5 transition-all">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded bg-purple-500/10 text-purple-500 flex items-center justify-center shadow-inner">
                                <Settings className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-1">Company Setup</h4>
                                <p className="text-xl font-black text-gray-800 dark:text-white tracking-tight">Standardized Config</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
