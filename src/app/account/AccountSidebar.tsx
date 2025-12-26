"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { User, Package, Heart, MapPin, Bell, Settings, LogOut } from "lucide-react";

interface AccountSidebarProps {
    user: {
        firstName: string | null;
        lastName: string | null;
        email: string;
        avatar: string | null;
    };
}

const menuItems = [
    { name: "Profile", href: "/account", icon: User },
    { name: "Orders", href: "/account/orders", icon: Package },
    { name: "Wishlist", href: "/account/wishlist", icon: Heart },
    { name: "Addresses", href: "/account/addresses", icon: MapPin },
    { name: "Notifications", href: "/account/notifications", icon: Bell },
    { name: "Settings", href: "/account/settings", icon: Settings },
];

export function AccountSidebar({ user }: AccountSidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="lg:w-64 flex-shrink-0">
            <div className="glass rounded-2xl p-6 sticky top-32">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-semibold">
                        {user.firstName?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium truncate">
                            {user.firstName ? `${user.firstName} ${user.lastName}` : "User"}
                        </p>
                        <p className="text-sm text-gray-400 truncate">{user.email}</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/account" && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                        ? "bg-purple-500/20 text-purple-400"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sign Out */}
                <div className="mt-6 pt-6 border-t border-white/10">
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
