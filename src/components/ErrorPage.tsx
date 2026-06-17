import { useRouteError, Link } from "react-router-dom";
import { Home, RefreshCw } from "lucide-react";
import Layout from "../Layout";

interface RouteError {
    status?: number;
    statusText?: string;
    message?: string;
    data?: string;
}

export default function ErrorPage() {
    const error = useRouteError() as RouteError;

    let statusCode = 500;
    let title = "Something went wrong";
    let description = "We encountered an unexpected error. Please try again later.";

    if (error?.status === 404) {
        statusCode = 404;
        title = "Page not found";
        description = "The event or page you're looking for doesn't exist or has been moved.";
    } else if (error?.status === 403) {
        statusCode = 403;
        title = "Access denied";
        description = "You don't have permission to view this page.";
    } else if (error?.status === 401) {
        statusCode = 401;
        title = "Unauthorized";
        description = "Please log in to access this page.";
    } else if (error?.message) {
        // Use custom error message if available
        description = error.message;
    }

    return (
        <Layout>
            <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center">
                <div className="max-w-md">
                    <div className="text-8xl font-light text-accent mb-4">{statusCode}</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">{description}</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-dark transition-colors"
                        >
                            <Home size={18} />
                            Go Home
                        </Link>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            <RefreshCw size={18} />
                            Try Again
                        </button>
                    </div>
                </div>
            </main>
        </Layout>
    );
}