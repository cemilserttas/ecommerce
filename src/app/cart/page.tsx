"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2, Tag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function CartPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { items, removeItem, updateQuantity, getSubtotal, promoCode, discount, setPromoCode, clearCart } = useCartStore();

    const [promoInput, setPromoInput] = useState("");
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const subtotal = getSubtotal();
    const shipping = subtotal >= 100 ? 0 : 9.99;
    const total = subtotal - discount + shipping;

    const handleApplyPromo = async () => {
        if (!promoInput.trim()) return;

        setIsApplyingPromo(true);
        try {
            const response = await fetch("/api/promo/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: promoInput, subtotal }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Invalid promo code");
            }

            setPromoCode(promoInput.toUpperCase(), data.discount);
            toast.success(`Promo code applied! You save ${formatPrice(data.discount)}`);
            setPromoInput("");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Invalid promo code");
        } finally {
            setIsApplyingPromo(false);
        }
    };

    const handleRemovePromo = () => {
        setPromoCode(null, 0);
        toast.success("Promo code removed");
    };

    const handleCheckout = async () => {
        if (!session) {
            router.push("/auth/login?callbackUrl=/cart");
            return;
        }

        if (items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setIsCheckingOut(true);
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map((item) => ({
                        productId: item.productId,
                        variantId: item.variantId,
                        quantity: item.quantity,
                        price: item.price,
                        name: item.name,
                        variantName: item.variantName,
                        image: item.image,
                    })),
                    promoCode,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Checkout failed");
            }

            // Redirect to Stripe checkout
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Checkout failed");
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-32 pb-20">
                <div className="container-custom">
                    <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                    {items.length === 0 ? (
                        <div className="text-center py-20">
                            <ShoppingBag className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                            <p className="text-gray-400 mb-6">
                                Looks like you haven&apos;t added anything yet.
                            </p>
                            <Link href="/products" className="btn-gradient inline-flex items-center gap-2">
                                Start Shopping <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                <AnimatePresence>
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            className="glass rounded-xl p-4 flex gap-4"
                                        >
                                            {/* Image */}
                                            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ShoppingBag className="w-8 h-8 text-gray-600" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/products/${item.productId}`}
                                                    className="font-medium hover:text-purple-400 transition-colors"
                                                >
                                                    {item.name}
                                                </Link>
                                                {item.variantName && (
                                                    <p className="text-sm text-gray-400 mt-0.5">{item.variantName}</p>
                                                )}
                                                <p className="text-purple-400 font-semibold mt-1">
                                                    {formatPrice(item.price)}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-10 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <span className="font-semibold">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </span>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                <button
                                    onClick={() => clearCart()}
                                    className="text-sm text-gray-400 hover:text-red-400 transition-colors"
                                >
                                    Clear Cart
                                </button>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="glass rounded-xl p-6 sticky top-32">
                                    <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

                                    {/* Promo Code */}
                                    <div className="mb-6">
                                        {promoCode ? (
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="w-4 h-4 text-green-400" />
                                                    <span className="text-green-400 font-medium">{promoCode}</span>
                                                </div>
                                                <button
                                                    onClick={handleRemovePromo}
                                                    className="text-gray-400 hover:text-white"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={promoInput}
                                                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                                    placeholder="Promo code"
                                                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                                <button
                                                    onClick={handleApplyPromo}
                                                    disabled={isApplyingPromo}
                                                    className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-500/30 disabled:opacity-50"
                                                >
                                                    {isApplyingPromo ? "..." : "Apply"}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Totals */}
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Subtotal</span>
                                            <span>{formatPrice(subtotal)}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex justify-between text-green-400">
                                                <span>Discount</span>
                                                <span>-{formatPrice(discount)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Shipping</span>
                                            <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                                        </div>
                                        {shipping > 0 && subtotal < 100 && (
                                            <p className="text-xs text-gray-500">
                                                Add {formatPrice(100 - subtotal)} more for free shipping
                                            </p>
                                        )}
                                        <div className="border-t border-white/10 pt-3">
                                            <div className="flex justify-between text-lg font-semibold">
                                                <span>Total</span>
                                                <span className="gradient-text">{formatPrice(total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <button
                                        onClick={handleCheckout}
                                        disabled={isCheckingOut || items.length === 0}
                                        className="w-full mt-6 btn-gradient flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isCheckingOut ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Proceed to Checkout
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>

                                    {!session && (
                                        <p className="text-xs text-gray-400 text-center mt-3">
                                            You&apos;ll need to sign in to checkout
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
