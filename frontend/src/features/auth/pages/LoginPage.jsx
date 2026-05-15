import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
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
        <div className="min-h-screen flex items-center justify-center bg-[#f8f7fa] p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl"></div>

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-konrix mb-4">
                        <Shield className="w-8 h-8 text-primary-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{APP_CONFIG.NAME}</h2>
                    <p className="text-gray-400 mt-1 font-medium">{APP_CONFIG.MESSAGES.LOGIN_SUBTITLE}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-konrix-lg p-8 border border-gray-100">
                    {error && (
                        <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm font-medium flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Email or Username</label>
                            <input 
                                type="text"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
                                placeholder="Enter your email"
                                value={loginInput}
                                onChange={(e) => setLoginInput(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-semibold text-gray-600">Password</label>
                                <a href="#" className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors">Forgot Password?</a>
                            </div>
                            <input 
                                type="password"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" id="remember" className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500" />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-500 font-medium cursor-pointer">Remember me</label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <LogIn className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-sm text-gray-400 font-medium">
                    Don't have an account? <a href="#" className="text-primary-500 hover:underline">Contact Support</a>
                </p>
            </div>
        </div>
    );
}
