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
    { name: 'Pending', value: 31.1, color: '#10b981' },
    { name: 'Done', value: 68.9, color: '#34d399' }
];

const barData = [
    { month: 'Feb', projects: 110, workingHours: 150 },
    { month: 'Mar', projects: 130, workingHours: 190 },
    { month: 'Apr', projects: 150, workingHours: 260 },
    { month: 'May', projects: 120, workingHours: 230 },
    { month: 'Jun', projects: 140, workingHours: 170 },
    { month: 'Jul', projects: 160, workingHours: 200 },
    { month: 'Aug', projects: 155, workingHours: 180 },
    { month: 'Sep', projects: 115, workingHours: 140 },
    { month: 'Oct', projects: 145, workingHours: 210 },
];

const DashboardOverview = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
                <h1 className="text-lg font-bold text-gray-800">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2 text-[11px] font-medium text-gray-400">
                <span>Agro ERP</span>
                <span className="text-gray-300">›</span>
                <span>Menu</span>
                <span className="text-gray-300">›</span>
                <span className="text-gray-600">Dashboard</span>
            </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
            {/* Left Main Content */}
            <div className="col-span-12 lg:col-span-9 space-y-6">
                
                {/* Top 4 Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'Project Dashboard', subtitle: 'New Task Assign', time: '4 Hrs ago', avatars: 2 },
                        { title: 'Admin Template', subtitle: 'New Task Assign', time: '3 Hrs ago', avatars: 3 },
                        { title: 'Client Project', subtitle: 'New Task Assign', time: '5 Hrs ago', avatars: 2 },
                        { title: 'Figma Design', subtitle: 'New Task Assign', time: '1 Day ago', avatars: 3 },
                    ].map((card, i) => (
                        <div key={i} className="card p-5 group hover:shadow-md border-none ring-1 ring-gray-100 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-[14px] text-gray-700 leading-tight">{card.title}</h3>
                                <button className="text-gray-300 hover:text-gray-500"><MoreHorizontal className="w-4 h-4" /></button>
                            </div>
                            <p className="text-[11px] text-gray-400 mb-5">{card.subtitle}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-[10px] text-gray-400 font-medium">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {card.time}
                                </div>
                                <div className="flex -space-x-1.5">
                                    {[...Array(card.avatars)].map((_, j) => (
                                        <div key={j} className="w-6 h-6 rounded-full border-2 border-white bg-primary-100 flex items-center justify-center text-[8px] font-bold text-primary-600 shadow-sm">
                                            U{j+1}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Monthly Target Pie Chart */}
                    <div className="card md:col-span-1 border-none ring-1 ring-gray-100 shadow-sm">
                        <div className="px-5 py-4 flex justify-between items-center">
                            <h3 className="text-[14px] font-bold text-gray-700">Monthly Target</h3>
                        </div>
                        <div className="p-5 h-[320px] relative">
                            <ResponsiveContainer width="100%" height="70%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={65}
                                        outerRadius={85}
                                        paddingAngle={5}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={450}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            
                            {/* Percentage in Middle */}
                            <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                <span className="text-2xl font-bold text-gray-700">88.9%</span>
                            </div>

                            <div className="flex justify-center gap-6 mt-8">
                                {pieData.map((item, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-[11px] font-bold text-gray-700">{item.name}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-medium">Projects</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Project Statistics Bar Chart */}
                    <div className="card md:col-span-2 border-none ring-1 ring-gray-100 shadow-sm">
                        <div className="px-5 py-4 flex justify-between items-center">
                            <h3 className="text-[14px] font-bold text-gray-700">Project Statistics</h3>
                            <div className="flex p-1 bg-gray-50 rounded-lg space-x-1">
                                {['All', '6M', '1Y'].map(t => (
                                    <button key={t} className={cn("px-3 py-1 text-[10px] font-bold rounded-md transition-all", t === 'All' ? "bg-primary-500 text-white shadow-sm" : "text-gray-400 hover:bg-gray-100")}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <div className="p-5 h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        cursor={{ fill: '#f8fafc' }}
                                    />
                                    <Bar dataKey="projects" fill="#10b981" radius={[4, 4, 0, 0]} barSize={8} />
                                    <Bar dataKey="workingHours" fill="#94a3b8" opacity={0.15} radius={[4, 4, 0, 0]} barSize={8} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Bottom Row Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: 'Active Projects', value: '85', icon: <Briefcase className="w-5 h-5" />, color: 'primary' },
                        { title: 'Total Employees', value: '32', icon: <UsersIcon className="w-5 h-5" />, color: 'emerald' },
                        { title: 'Project Reviews', value: '40', icon: <LayoutDashboardIcon className="w-5 h-5" />, color: 'sky' },
                    ].map((stat, i) => (
                        <div key={i} className="card p-5 flex items-center justify-between border-none ring-1 ring-gray-100 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-transform hover:scale-110 duration-300",
                                    stat.color === 'primary' ? "bg-primary-50 text-primary-500" :
                                    stat.color === 'emerald' ? "bg-emerald-50 text-emerald-500" : "bg-sky-50 text-sky-500"
                                )}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.title}</h4>
                                    <p className="text-xl font-extrabold text-gray-700">{stat.value}</p>
                                </div>
                            </div>
                            <button className="text-gray-200 hover:text-gray-400"><MoreHorizontal className="w-4 h-4" /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Sidebar Summary */}
            <div className="col-span-12 lg:col-span-3">
                <div className="card h-full border-none ring-1 ring-gray-100 shadow-sm flex flex-col">
                    <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="text-[14px] font-bold text-gray-700">Project Summary</h3>
                        <button className="text-gray-300 hover:text-gray-500"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                    <div className="p-5 space-y-6 flex-1">
                        <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 flex items-center gap-3">
                            <div className="p-1.5 bg-amber-100 rounded text-amber-600">
                                <AlertCircle className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-bold text-amber-800">38 Total Admin & Client Projects</span>
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: 'Project Discussion', count: '6 Person', color: 'bg-primary-50 text-primary-500', icon: <UsersIcon /> },
                                { title: 'In Progress', count: '16 Projects', color: 'bg-amber-50 text-amber-500', icon: <Clock /> },
                                { title: 'Completed Projects', count: '24', color: 'bg-emerald-50 text-emerald-500', icon: <CheckCircle2 /> },
                                { title: 'Delivery Projects', count: '20', color: 'bg-sky-50 text-sky-500', icon: <Navigation /> },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shadow-sm", item.color)}>
                                            {React.cloneElement(item.icon, { className: 'w-4 h-4' })}
                                        </div>
                                        <div>
                                            <h4 className="text-[13px] font-bold text-gray-700">{item.title}</h4>
                                            <p className="text-[11px] text-gray-400 font-bold">{item.count}</p>
                                        </div>
                                    </div>
                                    <button className="p-1 text-gray-200 group-hover:text-gray-400 border border-gray-100 rounded-full transition-colors">
                                        <Info className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-[13px] font-bold text-gray-700">On Time Completed Rate</h4>
                                <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[9px] font-bold shadow-sm">+ 59%</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-gray-400">Completed Projects</span>
                                    <span className="text-gray-700">65%</span>
                                </div>
                                <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-500 rounded-full shadow-sm" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                           <div className="p-5 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center group hover:border-primary-200 transition-colors cursor-pointer">
                               <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-lg flex items-center justify-center mb-3 text-gray-400 group-hover:text-primary-500 transition-colors">
                                   <Plus className="w-5 h-5" />
                               </div>
                               <h5 className="text-[13px] font-bold text-gray-700 mb-0.5">New Projects</h5>
                               <p className="text-[11px] text-gray-400 font-bold">25 Projects</p>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default DashboardOverview;
