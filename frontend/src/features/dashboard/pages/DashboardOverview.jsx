import React from 'react';
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
    MoreHorizontal, 
    Clock, 
    Info, 
    CheckCircle2, 
    AlertCircle, 
    Navigation,
    Plus,
    Users as UsersIcon,
    Briefcase,
    LayoutDashboard as LayoutDashboardIcon
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const pieData = [
    { name: 'Stock in Hand', value: 31.1, color: '#10b981' },
    { name: 'Distributed', value: 68.9, color: '#34d399' }
];

const barData = [
    { month: 'Jan', harvest: 110, demand: 150 },
    { month: 'Feb', harvest: 130, demand: 190 },
    { month: 'Mar', harvest: 150, demand: 260 },
    { month: 'Apr', harvest: 120, demand: 230 },
    { month: 'May', harvest: 140, demand: 170 },
    { month: 'Jun', harvest: 160, demand: 200 },
    { month: 'Jul', harvest: 155, demand: 180 },
    { month: 'Aug', harvest: 115, demand: 140 },
    { month: 'Sep', harvest: 145, demand: 210 },
];

const DashboardOverview = () => (
    <div className="pb-10 min-h-screen space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Premium Page Header */}
        <div className="sticky top-4 z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-6 rounded-md border border-gray-100/50 dark:border-gray-800/50 shadow-xl shadow-gray-500/5 transition-all mb-8">
            <div className="space-y-1 flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
                        <LayoutDashboardIcon className="w-5 h-5 text-primary-500" />
                    </div>
                    <span className="text-[10px] font-extrabold text-primary-500 uppercase tracking-[0.2em]">Agro ERP Enterprise</span>
                </div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Farm Operations</h1>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">Yield Analytics & Supply Chain</p>
            </div>
            
            <div className="flex items-center gap-6 flex-shrink-0">
                <div className="text-right">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Resource Efficiency</p>
                    <p className="text-2xl font-black text-emerald-500 leading-none mt-1">94.2%</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
            {/* Left Main Content */}
            <div className="col-span-12 lg:col-span-9 space-y-6">
                
                {/* Top 4 Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'Crop Lifecycle', subtitle: 'Growth Synchronization', time: '2 Hrs ago', avatars: 2, color: 'primary' },
                        { title: 'Livestock Health', subtitle: 'Biometric Matrix Scan', time: '1 Hr ago', avatars: 3, color: 'emerald' },
                        { title: 'Supply Chain', subtitle: 'Logistics Pipeline', time: '5 Hrs ago', avatars: 2, color: 'sky' },
                        { title: 'Warehouse Stock', subtitle: 'Inventory Archetype', time: '1 Day ago', avatars: 3, color: 'amber' },
                    ].map((card, i) => (
                        <div key={i} className="group/card relative bg-white dark:bg-gray-900 rounded-md p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-black text-[13px] text-gray-800 dark:text-white leading-tight uppercase tracking-tight">{card.title}</h3>
                                <button className="text-gray-200 hover:text-gray-400"><MoreHorizontal className="w-4 h-4" /></button>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">{card.subtitle}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                                    <Clock className="w-3.5 h-3.5 mr-1.5 text-primary-500" />
                                    {card.time}
                                </div>
                                <div className="flex -space-x-1.5">
                                    {[...Array(card.avatars)].map((_, j) => (
                                        <div key={j} className="w-7 h-7 rounded border-2 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[9px] font-black text-gray-500 shadow-sm">
                                            {String.fromCharCode(65 + i + j)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={cn("absolute bottom-0 left-0 h-1 bg-primary-500 transition-all duration-500 w-0 group-hover/card:w-full rounded-b-md")}></div>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Monthly Target Pie Chart */}
                    <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-500 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800/50 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/20">
                            <h3 className="text-[12px] font-black text-gray-800 dark:text-white uppercase tracking-widest">Inventory Status</h3>
                        </div>
                        <div className="p-6 h-[340px] relative">
                            <ResponsiveContainer width="100%" height="80%" minWidth={0} minHeight={0}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={450}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            
                            {/* Percentage in Middle */}
                            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                <span className="text-3xl font-black text-gray-800 dark:text-white tracking-tighter">72.4%</span>
                            </div>

                            <div className="flex justify-center gap-8 mt-4">
                                {pieData.map((item, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-[10px] font-black text-gray-800 dark:text-gray-300 uppercase tracking-widest">{item.name}</span>
                                        </div>
                                        <span className="text-[9px] text-gray-400 font-bold uppercase">Volume</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Project Statistics Bar Chart */}
                    <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-500 md:col-span-2 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800/50 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/20">
                            <h3 className="text-[12px] font-black text-gray-800 dark:text-white uppercase tracking-widest">Harvest Yield vs Demand</h3>
                            <div className="flex p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-md space-x-1 border border-gray-200/50 dark:border-gray-700/50">
                                {['Daily', 'Weekly', 'Monthly'].map(t => (
                                    <button key={t} className={cn("px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all", t === 'Monthly' ? "bg-white dark:bg-gray-700 text-primary-500 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200")}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 h-[340px]">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                                        cursor={{ fill: '#f8fafc', opacity: 0.5 }}
                                    />
                                    <Bar dataKey="harvest" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                                    <Bar dataKey="demand" fill="#94a3b8" opacity={0.15} radius={[4, 4, 0, 0]} barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Bottom Row Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: 'Active Crops', value: '124', icon: <Briefcase className="w-5 h-5" />, color: 'primary' },
                        { title: 'Field Personnel', value: '48', icon: <UsersIcon className="w-5 h-5" />, color: 'emerald' },
                        { title: 'Distribution Hubs', value: '12', icon: <LayoutDashboardIcon className="w-5 h-5" />, color: 'sky' },
                    ].map((stat, i) => (
                        <div key={i} className="group/stat bg-white dark:bg-gray-900 p-6 flex items-center justify-between rounded-md border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-primary-500/5 transition-all">
                            <div className="flex items-center gap-5">
                                <div className={cn(
                                    "w-14 h-14 rounded flex items-center justify-center transition-all duration-500 shadow-sm group-hover/stat:rotate-12 group-hover/stat:scale-110",
                                    stat.color === 'primary' ? "bg-primary-50 text-primary-500" :
                                    stat.color === 'emerald' ? "bg-emerald-50 text-emerald-500" : "bg-sky-50 text-sky-500"
                                )}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.title}</h4>
                                    <p className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">{stat.value}</p>
                                </div>
                            </div>
                            <button className="text-gray-200 hover:text-gray-400"><MoreHorizontal className="w-4 h-4" /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Sidebar Summary */}
            <div className="col-span-12 lg:col-span-3">
                <div className="bg-white dark:bg-gray-900 h-full rounded-md border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col hover:shadow-xl hover:shadow-gray-500/5 transition-all duration-500">
                    <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800/50 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/20">
                        <h3 className="text-[12px] font-black text-gray-800 dark:text-white uppercase tracking-widest">Operations Summary</h3>
                        <button className="text-gray-300 hover:text-gray-500"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                    <div className="p-6 space-y-8 flex-1">
                        <div className="p-4 bg-primary-500/5 dark:bg-primary-500/10 rounded border border-primary-500/10 flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary-500 rounded flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[14px] font-black text-primary-600 dark:text-primary-400 leading-tight">12 Active Farms</p>
                                <p className="text-[10px] font-bold text-primary-500/60 uppercase tracking-widest">Global Operations</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                { title: 'Soil Monitoring', count: '14 Nodes', color: 'bg-primary-50 text-primary-500', icon: <UsersIcon /> },
                                { title: 'Irrigation Sync', count: 'Active', color: 'bg-emerald-50 text-emerald-500', icon: <Clock /> },
                                { title: 'Pest Control', count: '85% Controlled', color: 'bg-sky-50 text-sky-500', icon: <CheckCircle2 /> },
                                { title: 'Fleet Tracking', count: '8 Active', color: 'bg-amber-50 text-amber-500', icon: <Navigation /> },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("w-11 h-11 rounded flex items-center justify-center shadow-sm transition-transform group-hover:scale-110", item.color)}>
                                            {React.cloneElement(item.icon, { className: 'w-4 h-4' })}
                                        </div>
                                        <div>
                                            <h4 className="text-[13px] font-black text-gray-800 dark:text-white uppercase tracking-tight">{item.title}</h4>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.count}</p>
                                        </div>
                                    </div>
                                    <button className="p-1.5 text-gray-200 group-hover:text-primary-500 transition-colors">
                                        <Info className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em]">Yield Performance</h4>
                                <span className="bg-emerald-500 text-white px-2.5 py-1 rounded text-[10px] font-black shadow-lg shadow-emerald-500/20">+ 12.4%</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                    <span className="text-gray-400">Total Harvested</span>
                                    <span className="text-primary-500">82%</span>
                                </div>
                                <div className="h-2 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800">
                                    <div className="h-full bg-primary-500 rounded-full shadow-sm" style={{ width: '82%' }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 pb-2">
                           <div className="p-6 bg-gray-50/50 dark:bg-gray-800/30 rounded border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center group hover:border-primary-500 transition-all cursor-pointer">
                               <div className="w-12 h-12 bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 rounded flex items-center justify-center mb-4 text-gray-300 group-hover:text-primary-500 group-hover:rotate-90 transition-all">
                                   <Plus className="w-6 h-6" />
                               </div>
                               <h5 className="text-[14px] font-black text-gray-800 dark:text-white uppercase tracking-tight mb-1">Add Farm Area</h5>
                               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Pending Configuration</p>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default DashboardOverview;
