import { UseAuth } from '../context/UseAuth'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function Login() {
    const { user, login } = UseAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<{ email: string, password: string }>({
        email: '',
        password: ''
    });

    useEffect(() => {
        if (user) {
            console.log(user);
            navigate('/');
        }
    }, [user]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await login(formData.email, formData.password);
        toast.success('Logged in successfully!');
        navigate('/');
    }

    return (
        <main className="flex items-center w-full lg:items-start">
            <div className=" flex-1 flex-col h-screen justify-end gap-4 bg-black hidden lg:flex">
                <NavLink to="/" className="text-2xl text-accent">Occasion</NavLink>
                <p className="text-md font-light text-inputaccent">Discover, organise, and experience events — from intimate gatherings to large-scale productions.</p>
                <ul className="text-md font-light text-inputaccent list-disc list-inside">
                    <li>Create public or collective events</li>
                    <li>Manual or instant ticket approval</li>
                    <li>Real-time check-in scanning</li>
                </ul>
            </div>
            <form className="flex flex-1 flex-col items-center h-screen px-8 md:px-32 lg:px-8 justify-center gap-4 w-full" onSubmit={handleSubmit}>
                <h2 className="text-xl">Login</h2>
                <input type="email" placeholder="Email" className="w-full bg-inputbg/30 border-inputaccent pl-9 pr-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-ring placeholder:text-muted-foreground" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <input type="password" placeholder="Password" className="w-full bg-inputbg/30 border-inputaccent pl-9 pr-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-ring placeholder:text-muted-foreground" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                <button type="submit" className="bg-accent text-white rounded-md px-4 py-2 w-full cursor-pointer">Login</button>
            </form>
        </main>
    )
}
