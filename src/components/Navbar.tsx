import logo from '../assets/Occasion.svg'
import { Menu, Compass, CircleX, Grid2x2, Boxes } from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { UseAuth } from '../context/UseAuth'
import { toast } from 'react-hot-toast'


export default function Navbar() {
    const [dropdown, setDropdown] = useState<boolean>(false);
    const { profile } = UseAuth();
    const [rerender, setRerender] = useState<boolean>(true);

    useEffect(() => {
        function set() {
            setRerender(e => !e)
        }
        set()
        console.log(rerender)
    }, [profile])


    return (
        <header className="fixed bg-background/20 backdrop-blur-2xl w-full z-10">
            <nav className="relative z-10 flex items-center justify-between px-2 lg:px-16 py-2 border-b border-inputaccent/50 w-full">
                <NavLink to="/" className="flex items-center justify-between gap-2">
                    <img src={logo} alt="logo" className="h-6 w-6" />
                    <h2 className="text-xl text-accent-dark">Occasion</h2>
                </NavLink>
                <div className="hidden md:flex items-center gap-4 text-sm">
                    <NavLink to="/" className={({ isActive }) => isActive ? "text-accent-dark  flex items-center gap-2 py-2 px-4 rounded-md bg-inputaccent/20" : "text-inputaccent flex items-center gap-2 py-2 px-4 rounded-md hover:bg-inputaccent/20"}>
                        {({ isActive }) => (
                            <>
                                <Compass
                                    color={isActive ? "var(--color-accent-dark)" : "var(--color-inputaccent)"}
                                    width={12}
                                    height={12}
                                />
                                Explore
                            </>
                        )}
                    </NavLink>
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-accent-dark  flex items-center gap-2 py-2 px-4 rounded-md bg-inputaccent/20" : "text-inputaccent flex items-center gap-2 py-2 px-4 rounded-md hover:bg-inputaccent/20"}>
                        {({ isActive }) => (
                            <>
                                <Grid2x2
                                    color={isActive ? "var(--color-accent-dark)" : "var(--color-inputaccent)"}
                                    width={16}
                                    height={16}
                                />
                                Dashboard
                            </>
                        )}
                    </NavLink>
                    <NavLink to="/collectives" className={({ isActive }) => isActive ? "text-accent-dark  flex items-center gap-2 py-2 px-4 rounded-md bg-inputaccent/20" : "text-inputaccent flex items-center gap-2 py-2 px-4 rounded-md hover:bg-inputaccent/20"}>
                        {({ isActive }) => (
                            <>
                                <Boxes
                                    color={isActive ? "var(--color-accent-dark)" : "var(--color-inputaccent)"}
                                    width={16}
                                    height={16}
                                />
                                Collectives
                            </>
                        )}
                    </NavLink>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <Link to="/new-event" className="bg-accent text-white rounded-md px-4 py-2 cursor-pointer text-sm">+ New Event</Link>
                    <div className="cursor-pointer">
                        {profile ? <NavLink to="/settings" onClick={() => { toast.loading("Loading Settings...", { duration: 1500 }) }}><img src={profile.avatar_url} alt="profile" className="h-8 w-8 rounded-full" /></NavLink> : <NavLink to="/login" onClick={() => { toast.loading("Loading Login...", { duration: 1500 }) }}><div className="bg-accent-dark rounded-md px-2 py-1 cursor-pointer text-white">Login</div></NavLink>}
                    </div>
                </div>
                <button className="md:hidden block cursor-pointer" onClick={() => { setDropdown(prev => !prev); console.log(dropdown); }}>{!dropdown ? <Menu color={`var(--color-accent-dark)`} /> : <CircleX color={`var(--color-accent-dark)`} />}</button>
                <div className={`${dropdown ? "block md:hidden" : "md:hidden hidden"} absolute top-full left-0 right-0 px-4 w-full bg-background border-t border-inputaccent/50`}>
                    <div className="flex  flex-col items-end gap-4 w-full mt-8 h-screen">
                        <NavLink to="/" className={({ isActive }) => isActive ? "text-accent-dark  flex items-center gap-2 py-2 px-4 rounded-md bg-inputaccent/20 w-full" : "text-inputaccent flex items-center gap-2 py-2 px-4 rounded-md hover:bg-inputaccent/20 w-full"}>
                            {({ isActive }) => (
                                <>
                                    <Compass
                                        color={isActive ? "var(--color-accent-dark)" : "var(--color-inputaccent)"}
                                        width={16}
                                        height={16}
                                    />
                                    Explore
                                </>
                            )}
                        </NavLink>
                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-accent-dark  flex items-center gap-2 py-2 px-4 rounded-md bg-inputaccent/20 w-full" : "text-inputaccent flex items-center gap-2 py-2 px-4 rounded-md hover:bg-inputaccent/20 w-full"}>
                            {({ isActive }) => (
                                <>
                                    <Grid2x2
                                        color={isActive ? "var(--color-accent-dark)" : "var(--color-inputaccent)"}
                                        width={16}
                                        height={16}
                                    />
                                    Dashboard
                                </>
                            )}
                        </NavLink>
                        <NavLink to="/collectives" className={({ isActive }) => isActive ? "text-accent-dark  flex items-center gap-2 py-2 px-4 rounded-md bg-inputaccent/20" : "text-inputaccent flex items-center gap-2 py-2 px-4 rounded-md hover:bg-inputaccent/20"}>
                            {({ isActive }) => (
                                <>
                                    <Boxes
                                        color={isActive ? "var(--color-accent-dark)" : "var(--color-inputaccent)"}
                                        width={16}
                                        height={16}
                                    />
                                    Collectives
                                </>
                            )}
                        </NavLink>
                        <button className="bg-accent text-white rounded-md px-4 py-2 w-full">+ New Event</button>
                        <div className="flex items-center gap-4 w-full">
                            {profile ? <NavLink to="/settings" onClick={() => { toast.loading("Loading Settings...", { duration: 1500 }) }}><img src={profile.avatar_url} alt="profile" className="h-8 w-8 rounded-full" /></NavLink> : <NavLink to="/login" onClick={() => { toast.loading("Loading Login...", { duration: 1500 }) }}><div className="bg-inputaccent rounded-full w-8 h-8 cursor-pointer"></div></NavLink>}
                            <NavLink to={profile ? "/settings" : "/login"} onClick={() => { toast.loading(`Loading ${profile ? "Settings" : "Login"}...`, { duration: 1500 }) }}><span className="w-full">{profile ? profile.full_name : "Login/SignUp"}</span></NavLink>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
