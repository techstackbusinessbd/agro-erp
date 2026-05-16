import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useSettings } from '../../../contexts/SettingsContext';
import { APP_CONFIG } from '../../../config/constants';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import { LogIn, Shield } from 'lucide-react';

export default function LoginPage() {
    const [loginInput, setLoginInput] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { settings } = useSettings();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await login({ login: loginInput, password });
            if (response.status === 'Success') {
                navigate('/dashboard');
            }
        } catch (err) {
            if (err.response && err.response.data) {
                const apiError = err.response.data;
                setError(apiError.message || 'Login failed.');
            } else {
                setError('A network error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative overflow-hidden">
            {/* Premium Background Decorations */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl"></div>

            <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-100 dark:border-gray-800 mb-6 group hover:rotate-12 transition-transform duration-500">
                        <Shield className="w-10 h-10 text-primary-500" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-2">
                        {settings.loading ? 'Agro ERP' : settings.short_name || 'Agro ERP'}
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                        <span className="h-px w-8 bg-gray-200 dark:bg-gray-800"></span>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Enterprise Access</p>
                        <span className="h-px w-8 bg-gray-200 dark:bg-gray-800"></span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-md shadow-2xl shadow-gray-500/10 p-10 border border-gray-100 dark:border-gray-800 relative overflow-hidden group/form">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary-500"></div>
                    
                    {error && (
                        <div className="mb-8 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded text-rose-600 dark:text-rose-400 text-[11px] font-black uppercase tracking-widest flex items-center animate-in shake duration-300">
                            <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Email or Username</label>
                            <input 
                                type="text"
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-md text-sm font-bold outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all dark:text-white placeholder:text-gray-300"
                                placeholder="Your email or username"
                                value={loginInput}
                                onChange={(e) => setLoginInput(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Password</label>
                                <a href="#" className="text-[10px] font-black text-primary-500 hover:text-primary-600 uppercase tracking-widest transition-colors">Forgot Key?</a>
                            </div>
                            <input 
                                type="password"
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-md text-sm font-bold outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all dark:text-white placeholder:text-gray-300"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" id="remember" className="w-4 h-4 text-primary-500 border-gray-300 dark:border-gray-700 rounded focus:ring-primary-500 bg-transparent" />
                            <label htmlFor="remember" className="ml-3 text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest cursor-pointer">Remember Device</label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-black py-5 rounded-md shadow-2xl shadow-primary-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 active:scale-[0.98] uppercase text-[11px] tracking-[0.3em]"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                <>
                                    <span>Login to Account</span>
                                    <LogIn className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-12 flex flex-col items-center gap-4">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                        System Error? <a href="#" className="text-primary-500 hover:text-primary-600 transition-colors">Contact Administrator</a>
                    </p>
                    <div className="flex items-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all">
                        <span className="text-[8px] font-black text-gray-500">v{APP_CONFIG.VERSION}</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-tighter">Enterprise Standard</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
