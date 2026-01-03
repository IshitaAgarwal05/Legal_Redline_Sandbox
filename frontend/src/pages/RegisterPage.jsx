import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppState } from '../state/StateContext';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { dispatch } = useAppState();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || 'Registration failed');
            }

            // Auto-login after registration
            const loginFormData = new FormData();
            loginFormData.append('username', username);
            loginFormData.append('password', password);

            const loginRes = await fetch(`${import.meta.env.VITE_API_BASE}/api/auth/login`, {
                method: 'POST',
                body: loginFormData
            });

            const loginData = await loginRes.json();
            localStorage.setItem('access_token', loginData.access_token);

            // Fetch user info
            const userRes = await fetch(`${import.meta.env.VITE_API_BASE}/api/users/me`, {
                headers: { 'Authorization': `Bearer ${loginData.access_token}` }
            });
            const userData = await userRes.json();

            // Dispatch to global state
            dispatch({ type: 'SET_USER', payload: userData });

            toast.success("Account created successfully!");
            navigate('/');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center -mt-20 px-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-700">
                <h2 className="text-3xl font-bold text-white mb-2 text-center">Create Account</h2>
                <p className="text-gray-400 text-center mb-8">Start your 2 free document analysis trials</p>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                            placeholder="johndoe"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-lg font-bold text-white transition-all ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20'
                            }`}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-400 hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
