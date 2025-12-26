"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Heart, ShoppingBag, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function WishlistPage() {
    const { items, removeItem, clearWishlist } = useWishlistStore();
    const addToCart = useCartStore((state) => state.addItem);
    const openCart = useCartStore((state) => state.openCart);

    const handleAddToCart = (item: typeof items[0]) => {
        addToCart({
            productId: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1,
        });
        removeItem(item.productId);
        toast.success("Added to cart!");
        openCart();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">My Wishlist</h1>
                    <p className="text-gray-400 mt-1">{items.length} saved items</p>
                </div>
                {items.length > 0 && (
                    <button
                        onClick={() => {
                            clearWishlist();
                            toast.success("Wishlist cleared");
                        }}
                        className="text-sm text-gray-400 hover:text-red-400 transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {items.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                    <Heart className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-400 mb-4">
                        Save items you love to buy them later.
                    </p>
                    <Link href="/products" className="btn-gradient inline-flex items-center gap-2">
                        Browse Products <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div
                                key={item.productId}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                                className="glass rounded-xl overflow-hidden group"
                            >
                                {/* Image */}
                                <Link href={`/products/${item.slug}`} className="block relative aspect-[3/4]">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                            <ShoppingBag className="w-12 h-12 text-gray-600" />
                                        </div>
                                    )}

                                    {/* Remove Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeItem(item.productId);
                                            toast.success("Removed from wishlist");
                                        }}
                                        className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-red-500/80 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </Link>

                                {/* Details */}
                                <div className="p-4">
                                    <Link
                                        href={`/products/${item.slug}`}
                                        className="font-medium line-clamp-1 hover:text-purple-400 transition-colors"
                                    >
                                        {item.name}
                                    </Link>

                                    <div className="flex items-center gap-2 mt-1 mb-3">
                                        <span className="text-purple-400 font-semibold">
                                            {formatPrice(item.price)}
                                        </span>
                                        {item.compareAtPrice && (
                                            <span className="text-sm text-gray-500 line-through">
                                                {formatPrice(item.compareAtPrice)}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="w-full py-2.5 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        Add to Cart
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
