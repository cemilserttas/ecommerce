"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    ShoppingBag,
    Heart,
    User,
    Menu,
    X,
    ChevronDown,
    LogOut,
    Package,
    Settings,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

const categories = [
    { name: "New Arrivals", href: "/products?filter=new" },
    { name: "Women", href: "/products?category=women" },
    { name: "Men", href: "/products?category=men" },
    { name: "Accessories", href: "/products?category=accessories" },
    { name: "Sale", href: "/products?filter=sale", highlight: true },
];

export function Header() {
    const { data: session } = useSession();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const cartItemCount = useCartStore((state) => state.getItemCount());
    const wishlistItemCount = useWishlistStore((state) => state.items.length);
    const openCart = useCartStore((state) => state.openCart);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                        ? "bg-black/80 backdrop-blur-xl border-b border-white/10"
                        : "bg-transparent"
                    }`}
            >
                <div className="container-custom">
                    {/* Top Bar */}
                    <div className="hidden md:flex items-center justify-between py-2 text-xs text-gray-400 border-b border-white/5">
                        <p>Free shipping on orders over $100</p>
                        <div className="flex items-center gap-4">
                            <Link href="/help" className="hover:text-white transition-colors">
                                Help
                            </Link>
                            <Link href="/track-order" className="hover:text-white transition-colors">
                                Track Order
                            </Link>
                        </div>
                    </div>

                    {/* Main Header */}
                    <div className="flex items-center justify-between py-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold gradient-text">LUXE</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {categories.map((category) => (
                                <Link
                                    key={category.name}
                                    href={category.href}
                                    className={`text-sm font-medium transition-colors hover:text-purple-400 ${category.highlight ? "text-pink-500" : "text-gray-300"
                                        }`}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            {/* Search */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Wishlist */}
                            <Link
                                href={session ? "/account/wishlist" : "/auth/login?callbackUrl=/account/wishlist"}
                                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Heart className="w-5 h-5" />
                                {wishlistItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-xs font-bold rounded-full flex items-center justify-center">
                                        {wishlistItemCount}
                                    </span>
                                )}
                            </Link>

                            {/* Cart */}
                            <button
                                onClick={openCart}
                                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-xs font-bold rounded-full flex items-center justify-center">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1"
                                >
                                    <User className="w-5 h-5" />
                                    <ChevronDown className="w-4 h-4 hidden sm:block" />
                                </button>

                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-56 glass rounded-xl shadow-xl overflow-hidden"
                                        >
                                            {session ? (
                                                <>
                                                    <div className="px-4 py-3 border-b border-white/10">
                                                        <p className="text-sm font-medium">
                                                            {session.user.firstName} {session.user.lastName}
                                                        </p>
                                                        <p className="text-xs text-gray-400">{session.user.email}</p>
                                                    </div>
                                                    <div className="py-2">
                                                        <Link
                                                            href="/account"
                                                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                                                            onClick={() => setIsUserMenuOpen(false)}
                                                        >
                                                            <User className="w-4 h-4" />
                                                            My Account
                                                        </Link>
                                                        <Link
                                                            href="/account/orders"
                                                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                                                            onClick={() => setIsUserMenuOpen(false)}
                                                        >
                                                            <Package className="w-4 h-4" />
                                                            Orders
                                                        </Link>
                                                        {session.user.role !== "CLIENT" && (
                                                            <Link
                                                                href="/manager"
                                                                className="flex items-center gap-3 px-4 py-2 text-sm text-purple-400 hover:bg-white/10 transition-colors"
                                                                onClick={() => setIsUserMenuOpen(false)}
                                                            >
                                                                <Settings className="w-4 h-4" />
                                                                Manager Dashboard
                                                            </Link>
                                                        )}
                                                    </div>
                                                    <div className="border-t border-white/10 py-2">
                                                        <button
                                                            onClick={() => signOut()}
                                                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors w-full"
                                                        >
                                                            <LogOut className="w-4 h-4" />
                                                            Sign Out
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="py-2">
                                                    <Link
                                                        href="/auth/login"
                                                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        Sign In
                                                    </Link>
                                                    <Link
                                                        href="/auth/register"
                                                        className="flex items-center gap-3 px-4 py-2 text-sm text-purple-400 hover:bg-white/10 transition-colors"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        Create Account
                                                    </Link>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-50 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed left-0 top-0 bottom-0 w-80 bg-background border-r border-white/10 z-50 lg:hidden"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <span className="text-xl font-bold gradient-text">LUXE</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <nav className="p-4">
                                {categories.map((category) => (
                                    <Link
                                        key={category.name}
                                        href={category.href}
                                        className={`block py-3 text-lg font-medium ${category.highlight ? "text-pink-500" : ""
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Search Modal */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-20"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="w-full max-w-2xl mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="glass rounded-2xl p-4">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search for products..."
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
