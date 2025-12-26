"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Bell, Search, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ManagerHeaderProps {
    user: {
        firstName: string | null;
        lastName: string | null;
        email: string;
        avatar: string | null;
        role: string;
    };
}

export function ManagerHeader({ user }: ManagerHeaderProps) {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 right-0 left-64 h-16 bg-background-secondary/80 backdrop-blur-xl border-b border-white/10 z-30">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Search */}
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products, orders, customers..."
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </button>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-sm font-semibold">
                                {user.firstName?.[0] || user.email[0].toUpperCase()}
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-sm font-medium">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-gray-400">{user.role}</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>

                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-56 glass rounded-xl shadow-xl overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-white/10">
                                        <p className="text-sm font-medium">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                    </div>
                                    <div className="py-2">
                                        <button className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/10 transition-colors w-full">
                                            <User className="w-4 h-4" />
                                            Profile
                                        </button>
                                        <button className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/10 transition-colors w-full">
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </button>
                                    </div>
                                    <div className="border-t border-white/10 py-2">
                                        <button
                                            onClick={() => signOut({ callbackUrl: "/" })}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors w-full"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}
