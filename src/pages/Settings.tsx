import Layout from "../Layout";
import { UseAuth } from "../context/UseAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


export default function Settings() {
    const { user, logout } = UseAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    }
    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-12">
                <h1>Profile</h1>
                <p>Logged in as {user?.email}</p>
                <button onClick={handleLogout} className="bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-dark transition-colors shadow-sm">Logout</button>
            </div>
        </Layout>
    )
}
