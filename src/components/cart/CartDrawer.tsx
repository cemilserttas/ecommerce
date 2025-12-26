"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore, CartItem } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getTotal } = useCartStore();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50"
                        onClick={closeCart}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background-secondary border-l border-white/10 z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                <span className="font-semibold">Shopping Cart</span>
                                <span className="text-sm text-gray-400">({items.length} items)</span>
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                                    <p className="text-gray-400 mb-6">
                                        Looks like you haven&apos;t added anything yet.
                                    </p>
                                    <button
                                        onClick={closeCart}
                                        className="btn-gradient"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <CartItemCard
                                            key={item.id}
                                            item={item}
                                            onRemove={() => removeItem(item.id)}
                                            onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-white/10 p-4 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(getSubtotal())}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span>Shipping</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                    <div className="flex items-center justify-between text-lg font-semibold pt-2 border-t border-white/10">
                                        <span>Total</span>
                                        <span className="gradient-text">{formatPrice(getTotal())}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="btn-gradient w-full text-center block"
                                >
                                    Proceed to Checkout
                                </Link>

                                <button
                                    onClick={closeCart}
                                    className="w-full py-3 text-center text-gray-400 hover:text-white transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function CartItemCard({
    item,
    onRemove,
    onUpdateQuantity,
}: {
    item: CartItem;
    onRemove: () => void;
    onUpdateQuantity: (qty: number) => void;
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/10"
        >
            {/* Image */}
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
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
                <h4 className="font-medium text-sm truncate">{item.name}</h4>
                {item.variantName && (
                    <p className="text-xs text-gray-400 mt-0.5">{item.variantName}</p>
                )}
                <p className="text-purple-400 font-semibold mt-1">{formatPrice(item.price)}</p>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onUpdateQuantity(item.quantity - 1)}
                            className="p-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(item.quantity + 1)}
                            className="p-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>

                    <button
                        onClick={onRemove}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
