import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare, Settings, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { logout, authUser } = useAuthStore();

    return (
        <header className="fixed top-0 w-full z-50 bg-base-100/80 backdrop-blur-lg border-b border-base-300">
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                {/* Left - Logo */}
                <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <h1 className="text-lg font-bold">Chatty</h1>
                </Link>

                {/* Right - Links */}
                <div className="flex items-center gap-2">
                    <Link to="/settings" className="btn btn-sm gap-2 transition-colors">
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Settings</span>
                    </Link>

                    {authUser ? (
                        <>
                            <Link to="/profile" className="btn btn-sm gap-2">
                                <User className="size-5" />
                                <span className="hidden sm:inline">Profile</span>
                            </Link>
                            <button className="btn btn-sm flex gap-2 items-center" onClick={logout}>
                                <LogOut className="size-5" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    ) : null}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
