import React, { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient';
import { 
    ClipboardList, 
    Search, 
    User, 
    Calendar, 
    Cpu, 
    History, 
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuditLogsPage() {
    const [activeTab, setActiveTab] = useState('audit'); // 'audit' or 'login'
    const [auditLogs, setAuditLogs] = useState([]);
    const [loginHistories, setLoginHistories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Pagination states
    const [auditMeta, setAuditMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loginMeta, setLoginMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    
    // Expanded row states for audit details
    const [expandedRows, setExpandedRows] = useState({});

    useEffect(() => {
        if (activeTab === 'audit') {
            fetchAuditLogs(1);
        } else {
            fetchLoginHistories(1);
        }
    }, [activeTab, searchQuery]);

    const fetchAuditLogs = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/auth/audit-logs', {
                params: {
                    page,
                    search: searchQuery,
                    per_page: 10
                }
            });
            if (response.data?.status === 'Success' || response.data?.data) {
                setAuditLogs(response.data.data.data || []);
                setAuditMeta(response.data.data.meta || { current_page: 1, last_page: 1, total: 0 });
            }
        } catch (error) {
            console.error('Error fetching audit logs', error);
            toast.error('Failed to load audit logs');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLoginHistories = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/auth/login-histories', {
                params: {
                    page,
                    search: searchQuery,
                    per_page: 10
                }
            });
            if (response.data?.status === 'Success' || response.data?.data) {
                setLoginHistories(response.data.data.data || []);
                setLoginMeta(response.data.data.meta || { current_page: 1, last_page: 1, total: 0 });
            }
        } catch (error) {
            console.error('Error fetching login histories', error);
            toast.error('Failed to load login histories');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleRow = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const getActionBadgeClass = (action) => {
        switch (action) {
            case 'CREATE':
                return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
            case 'UPDATE':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
            case 'DELETE':
                return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
            default:
                return 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="pb-10 min-h-screen space-y-8">
            {/* Premium Sticky Header */}
            <div className="sticky top-4 z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-6 rounded-md border border-gray-100/50 dark:border-gray-800/50 shadow-xl shadow-gray-500/5 transition-all mb-8">
                <div className="space-y-1 shrink-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 rounded bg-primary-500/10 flex items-center justify-center">
                            <ClipboardList className="w-4.5 h-4.5 text-primary-500" />
                        </div>
                        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 tracking-wider">Security & Compliance</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Compliance Audit Portal</h1>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Tier-1 ERP system-wide record audit trail, security events logs, and active session histories.
                    </p>
                </div>

                {/* Modern Pill Tabs */}
                <div className="flex bg-gray-100/80 dark:bg-gray-800/50 p-1.5 rounded-lg border border-gray-200/50 dark:border-gray-800/60 gap-1.5 shrink-0 self-start lg:self-center">
                    <button
                        onClick={() => { setActiveTab('audit'); setSearchQuery(''); }}
                        className={`py-2 px-4 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                            activeTab === 'audit'
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-800/50'
                        }`}
                    >
                        <Cpu className="h-3.5 w-3.5" />
                        Record Audit Trail
                    </button>
                    <button
                        onClick={() => { setActiveTab('login'); setSearchQuery(''); }}
                        className={`py-2 px-4 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                            activeTab === 'login'
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-800/50'
                        }`}
                    >
                        <History className="h-3.5 w-3.5" />
                        User Session Logs
                    </button>
                </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-md border border-gray-155 dark:border-gray-800 shadow-xl shadow-gray-500/5">
                <div className="relative flex-1 max-w-lg group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search logs by IP, User, Model..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all"
                    />
                </div>

                <div className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 tracking-wider uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Total Records Captured:{' '}
                    <span className="text-gray-900 dark:text-white font-extrabold text-xs">
                        {activeTab === 'audit' ? auditMeta.total : loginMeta.total}
                    </span>
                </div>
            </div>

            {/* Logs Table container */}
            <div className="bg-white dark:bg-gray-900 rounded-md shadow-xl shadow-gray-500/5 border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300">
                {isLoading ? (
                    <div className="py-24 text-center text-gray-500 text-sm flex flex-col items-center justify-center gap-3">
                        <Loader2 className="animate-spin rounded-full h-8 w-8 text-primary-500" />
                        <span className="font-semibold text-gray-650 dark:text-gray-400">Retrieving compliance ledger...</span>
                    </div>
                ) : activeTab === 'audit' ? (
                    /* Audit logs view */
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event Type</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject Model</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mutated Record ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User Initiator</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP Address</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timestamp</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                                {auditLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="py-16 text-center text-gray-400 dark:text-gray-500 text-sm italic font-medium">
                                            No compliance mutation logs found matching filter.
                                        </td>
                                    </tr>
                                ) : (
                                    auditLogs.map((log) => (
                                        <React.Fragment key={log.id}>
                                            <tr className="hover:bg-gray-50/30 dark:hover:bg-gray-800/20 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider uppercase ${getActionBadgeClass(log.action)}`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-gray-850 dark:text-gray-250 text-sm">
                                                    {log.auditable_type.split('\\').pop()}
                                                </td>
                                                <td className="px-6 py-4 text-xs font-mono text-gray-500">
                                                    {log.auditable_id}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {log.user ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded bg-primary-500/10 flex items-center justify-center text-primary-500 font-bold text-xs">
                                                                {log.user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-900 dark:text-white font-semibold block text-xs">{log.user.name}</span>
                                                                <span className="text-[10px] text-gray-450 dark:text-gray-400 block">{log.user.email}</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 dark:text-gray-500 text-xs font-mono tracking-wider font-semibold">SYSTEM_JOB</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-xs font-mono text-gray-600 dark:text-gray-300">
                                                    {log.ip_address || '127.0.0.1'}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 dark:text-gray-450 text-xs">
                                                    {formatDate(log.created_at)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => toggleRow(log.id)}
                                                        className="text-xs text-primary-500 hover:text-primary-600 font-bold flex items-center gap-1 ml-auto"
                                                    >
                                                        {expandedRows[log.id] ? (
                                                            <>Hide <ChevronUp className="h-3.5 w-3.5" /></>
                                                        ) : (
                                                            <>Review Details <ChevronDown className="h-3.5 w-3.5" /></>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                            {/* Expandable audit visual comparison JSON */}
                                            {expandedRows[log.id] && (
                                                <tr className="bg-gray-55/20 dark:bg-gray-950/20">
                                                    <td colSpan="7" className="bg-gray-50/50 dark:bg-gray-800/10 p-6 border-l-4 border-primary-500 shadow-inner">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                                                            <div className="space-y-1.5">
                                                                <h4 className="text-rose-600 dark:text-rose-400 font-extrabold uppercase text-[10px] tracking-wider">Before Mutation (Old State)</h4>
                                                                <pre className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-850 p-4 rounded-md overflow-auto max-h-64 text-gray-700 dark:text-gray-300 shadow-inner">
                                                                    {JSON.stringify(log.old_values || {}, null, 2)}
                                                                </pre>
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <h4 className="text-emerald-600 dark:text-emerald-400 font-extrabold uppercase text-[10px] tracking-wider">After Mutation (New State)</h4>
                                                                <pre className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-850 p-4 rounded-md overflow-auto max-h-64 text-gray-700 dark:text-gray-300 shadow-inner">
                                                                    {JSON.stringify(log.new_values || {}, null, 2)}
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* Login histories view */
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User Initiator</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Session IP Address</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client User Agent</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Login Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                                {loginHistories.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-16 text-center text-gray-400 dark:text-gray-500 text-sm italic font-medium">
                                            No user login histories found matching filter.
                                        </td>
                                    </tr>
                                ) : (
                                    loginHistories.map((hist) => (
                                        <tr key={hist.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/20 transition-colors">
                                            <td className="px-6 py-4">
                                                {hist.user ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded bg-primary-500/10 flex items-center justify-center text-primary-500 font-bold text-xs">
                                                            {hist.user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-900 dark:text-white font-semibold block text-xs">{hist.user.name}</span>
                                                            <span className="text-[10px] text-gray-450 dark:text-gray-400 block">{hist.user.email}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500 text-xs font-mono tracking-wider font-semibold">UNKNOWN</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-mono text-gray-800 dark:text-gray-250 font-bold">
                                                {hist.ip_address}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 max-w-sm truncate" title={hist.user_agent}>
                                                {hist.user_agent}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-450 text-xs flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                {formatDate(hist.logged_in_at)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="bg-gray-50/50 dark:bg-gray-800/50 p-4 border-t border-gray-150 dark:border-gray-800 flex justify-between items-center text-xs">
                    <div className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                        Page {activeTab === 'audit' ? auditMeta.current_page : loginMeta.current_page} of{' '}
                        {activeTab === 'audit' ? auditMeta.last_page : loginMeta.last_page}
                    </div>
                    <div className="flex gap-2">
                        <button
                            disabled={activeTab === 'audit' ? auditMeta.current_page === 1 : loginMeta.current_page === 1}
                            onClick={() => {
                                if (activeTab === 'audit') {
                                    fetchAuditLogs(auditMeta.current_page - 1);
                                } else {
                                    fetchLoginHistories(loginMeta.current_page - 1);
                                }
                            }}
                            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 font-bold text-[10px] uppercase tracking-wider rounded transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            disabled={activeTab === 'audit' ? auditMeta.current_page === auditMeta.last_page : loginMeta.current_page === loginMeta.last_page}
                            onClick={() => {
                                if (activeTab === 'audit') {
                                    fetchAuditLogs(auditMeta.current_page + 1);
                                } else {
                                    fetchLoginHistories(loginMeta.current_page + 1);
                                }
                            }}
                            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 font-bold text-[10px] uppercase tracking-wider rounded transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
