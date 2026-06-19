import { UseAuth } from "../context/UseAuth";
import Layout from "../Layout";
import { useEffect } from "react";
import { useNavigate, useLoaderData, NavLink } from "react-router-dom";
import type { Profile } from "../interfaces";

export default function Dashboard() {
    const { user } = UseAuth();
    const { Profile } = useLoaderData() as { Profile: Profile };
    console.log(Profile);
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    return (
        <Layout>
            <main className="flex gap-4 items-center px-4 py-8 lg:px-8 lg:py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-20 w-full">
                    <img src={Profile.avatar_url} alt="Profile Avatar" className="rounded-full w-32 h-32" />
                    <div className="flex flex-col gap-4 items-center  md:items-start">
                        <h1 className="text-3xl font-bold">{Profile.full_name}</h1>
                        <p className="text-sm font-light text-inputaccent text-center md:text-start">{Profile.bio}</p>
                    </div>
                    <NavLink to="/settings" className="flex shrink-0 items-center gap-2 px-4 py-2 rounded-lg border border-inputaccent/30 text-sm text-gray-700 hover:bg-accent hover:text-white hover:border-accent transition-colors">Edit Profile</NavLink>
                </div>

            </main>
        </Layout>
    )
}
