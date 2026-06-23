import React from 'react';
import { Link } from 'react-router-dom';
const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-gray-200 bg-white py-6 mt-10 flex-1">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
                <div className="text-center md:text-left">
                    <p>© {currentYear} NestFind. All rights reserved.</p>
                    <p className="mt-1">
                        Made with ❤️ by{' '}
                        <a
                            href="https://github.com/TOV-003"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-800 hover:text-black font-medium"
                        >
                            Victor Toba-Ogunleye
                        </a>
                    </p>
                </div>
                <div className="flex gap-6">
                    <Link to="/about" className="hover:text-black transition">About</Link>
                    <a href="mailto:victortoba03@gmail.com" className="hover:text-black transition">Contact</a>
                    <a
                        href="https://github.com/TOV-003"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-black transition"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;