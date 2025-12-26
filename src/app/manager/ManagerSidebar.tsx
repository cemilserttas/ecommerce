"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    FileText,
    Image,
    Tag,
    Ticket,
    Settings,
    BarChart3,
    Folder,
    MessageSquare,
} from "lucide-react";

const menuItems = [
    {
        title: "Overview",
        items: [
            { name: "Dashboard", href: "/manager", icon: LayoutDashboard },
            { name: "Analytics", href: "/manager/analytics", icon: BarChart3 },
        ],
    },
    {
        title: "Catalog",
        items: [
            { name: "Products", href: "/manager/products", icon: Package },
            { name: "Categories", href: "/manager/categories", icon: Folder },
            { name: "Tags", href: "/manager/tags", icon: Tag },
        ],
    },
    {
        title: "Sales",
        items: [
            { name: "Orders", href: "/manager/orders", icon: ShoppingCart },
            { name: "Customers", href: "/manager/customers", icon: Users },
            { name: "Promo Codes", href: "/manager/promo-codes", icon: Ticket },
        ],
    },
    {
        title: "Content",
        items: [
            { name: "Blog Posts", href: "/manager/blog", icon: FileText },
            { name: "Static Pages", href: "/manager/pages", icon: Image },
            { name: "Banners", href: "/manager/banners", icon: Image },
        ],
    },
    {
        title: "System",
        items: [
            { name: "Settings", href: "/manager/settings", icon: Settings },
        ],
    },
];

export function ManagerSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-background-secondary border-r border-white/10 z-40 overflow-y-auto">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <Link href="/manager" className="flex items-center gap-2">
                    <span className="text-xl font-bold gradient-text">LUXE</span>
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                        Manager
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="p-4">
                {menuItems.map((section) => (
                    <div key={section.title} className="mb-6">
                        <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {section.title}
                        </h3>
                        <ul className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href ||
                                    (item.href !== "/manager" && pathname.startsWith(item.href));

                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                                    ? "bg-purple-500/20 text-purple-400"
                                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                }`}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            <span className="text-sm">{item.name}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Back to Store */}
            <div className="p-4 border-t border-white/10">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                    ← Back to Store
                </Link>
            </div>
        </aside>
    );
}
