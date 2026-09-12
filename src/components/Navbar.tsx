import logo from '../assets/Occasion.svg';
import { Menu, Compass, CircleX, Grid2x2, Boxes, Bookmark } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { UseAuth } from '../context/UseAuth';
import { toast } from 'react-hot-toast';
const NAV_LINKS = [
    { to: '/', label: 'Explore', icon: Compass, loadingMessage: 'Loading Explore Page...', loadingDuration: 500 },
    { to: '/dashboard', label: 'Dashboard', icon: Grid2x2, loadingMessage: 'Loading Dashboard...', loadingDuration: 1500 },
    { to: '/collectives', label: 'Collectives', icon: Boxes, loadingMessage: 'Loading Collectives...', loadingDuration: 500 },
    { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark, loadingMessage: 'Loading Bookmarks...', loadingDuration: 500 },
];

function navLinkClass(isActive: boolean, isMobile: boolean) {
    const state = isActive
        ? 'text-accent-dark bg-inputaccent/20'
        : 'text-inputaccent hover:bg-inputaccent/20';
    return `${state} flex items-center gap-2 py-2 px-4 rounded-md ${isMobile ? 'w-full' : ''} cursor-pointer`;
}

export default function Navbar() {
    const [dropdown, setDropdown] = useState<boolean>(false);
    const { profile } = UseAuth();
    return (<header className="fixed bg-background/20 backdrop-blur-2xl w-full z-20">
            <nav className="relative z-20 flex items-center justify-between px-2 lg:px-16 py-2 border-b border-inputaccent/50 w-full">
                <NavLink to="/" className="flex items-center justify-between gap-2 cursor-pointer">
                    <img src={logo} alt="logo" className="h-6 w-6"/>
                    <h2 className="text-xl text-accent-dark">Occasion</h2>
                </NavLink>
                <div className="hidden md:flex items-center gap-4 text-sm">
                    {NAV_LINKS.map(function (link) {
            const Icon = link.icon;
            return (<NavLink key={link.to} to={link.to} onClick={function () {
                    return toast.loading(link.loadingMessage, { duration: link.loadingDuration });
                }} className={function ({ isActive }) {
                    return navLinkClass(isActive, false);
                }}>
                        {function ({ isActive }) {
                    return (<>
                                <Icon color={isActive ? "var(--color-accent-dark)" : "var(--color-inputaccent)"} width={16} height={16}/>
                                {link.label}
                            </>);
                }}
                    </NavLink>);
        })}
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <Link to="/new-collective" className="border border-accent text-accent rounded-md px-4 py-2 cursor-pointer text-sm hover:bg-accent/5">+ New Collective</Link>
                    <Link to="/new-event" className="bg-accent text-white rounded-md px-4 py-2 cursor-pointer text-sm">+ New Event</Link>
                    <div className="cursor-pointer">
                        {profile ? <NavLink to="/settings" onClick={function () { toast.loading("Loading Settings...", { duration: 1500 }); }}><img src={profile.avatar_url} alt="profile" className="h-8 w-8 rounded-full"/></NavLink> : <NavLink to="/login" onClick={function () { toast.loading("Loading Login...", { duration: 1500 }); }}><div className="bg-accent-dark rounded-md px-2 py-1 cursor-pointer text-white">Login</div></NavLink>}
                    </div>
                </div>
                <button className="md:hidden block cursor-pointer" onClick={function () {
            setDropdown(function (prev) {
                return !prev;
            });
        }}>{!dropdown ? <Menu color={`var(--color-accent-dark)`}/> : <CircleX color={`var(--color-accent-dark)`}/>}</button>
                <div className={`${dropdown ? "block md:hidden" : "md:hidden hidden"} absolute top-full left-0 right-0 px-4 w-full bg-background border-t border-inputaccent/50`}>
                    <div className="flex  flex-col items-end gap-4 w-full mt-8 h-screen">
                        {NAV_LINKS.map(function (link) {
            const Icon = link.icon;
            return (<NavLink key={link.to} to={link.to} className={function ({ isActive }) {
                    return navLinkClass(isActive, true);
                }}>
                                {function ({ isActive }) {
                    return (<>
                                        <Icon color={isActive ? "var(--color-accent-dark)" : "var(--color-inputaccent)"} width={16} height={16}/>
                                        {link.label}
                                    </>);
                }}
                            </NavLink>);
        })}
                        <Link to="/new-collective" className="border border-accent text-accent rounded-md px-4 py-2 w-full text-center cursor-pointer">+ New Collective</Link>
                        <Link to="/new-event" className="bg-accent text-white rounded-md px-4 py-2 w-full text-center cursor-pointer">+ New Event</Link>
                        <div className="flex items-center gap-4 w-full cursor-pointer">
                            {profile ? <NavLink to="/settings" onClick={function () { toast.loading("Loading Settings...", { duration: 1500 }); }}><img src={profile.avatar_url} alt="profile" className="h-8 w-8 rounded-full cursor-pointer"/></NavLink> : <NavLink to="/login" onClick={function () { toast.loading("Loading Login...", { duration: 1500 }); }}><div className="bg-inputaccent rounded-full w-8 h-8 cursor-pointer"></div></NavLink>}
                            <NavLink to={profile ? "/settings" : "/login"} onClick={function () { toast.loading(`Loading ${profile ? "Settings" : "Login"}...`, { duration: 1500 }); }} className="cursor-pointer"><span className="w-full">{profile ? profile.full_name : "Login/SignUp"}</span></NavLink>
                        </div>
                    </div>
                </div>
            </nav>
        </header>);
}
