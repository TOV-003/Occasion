import { UseAuth } from '../context/UseAuth';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function Login() {
    const { user, login, loginWithGoogle } = UseAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<{ email: string; password: string }>({
        email: '',
        password: '',
    });

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await login(formData.email, formData.password);
        toast.success('Logged in successfully!');
        navigate('/');
    }

    async function handleGoogleLogin() {
        await loginWithGoogle()
            .then(() => {
                toast.success('Logged in successfully!');
                navigate('/settings');
            })

    }

    return (
        <main className="flex min-h-screen w-full">
            {/* Left side – Branding (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-black text-white flex-col justify-center px-12 py-16">
                <NavLink to="/" className="text-3xl font-bold text-accent mb-4">
                    Occasion
                </NavLink>
                <p className="text-lg font-light text-gray-300 max-w-md">
                    Discover, organise, and experience events — from intimate gatherings to large‑scale productions.
                </p>
                <ul className="mt-6 space-y-2 text-gray-300 list-disc list-inside">
                    <li>Create public or collective events</li>
                    <li>Manual or instant ticket approval</li>
                    <li>Real‑time check‑in scanning</li>
                </ul>
            </div>

            {/* Right side – Login form */}
            <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                        <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className="w-full bg-inputbg/30 border border-inputaccent rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-muted-foreground"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-inputbg/30 border border-inputaccent rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-muted-foreground"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-accent text-white font-semibold py-3 rounded-lg hover:bg-accent-dark transition-colors shadow-sm"
                        >
                            Sign in
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-inputaccent/30"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-4 text-gray-500">or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg border border-inputaccent/30 transition-all shadow-sm hover:shadow-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            <path fill="none" d="M0 0h48v48H0z" />
                        </svg>
                        Sign in with Google
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <NavLink to="/signup" className="text-accent hover:underline font-medium">
                            Sign up
                        </NavLink>
                    </p>
                </div>
            </div>
        </main>
    );
}