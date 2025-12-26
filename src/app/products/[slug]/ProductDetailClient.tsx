"use client";

import { useState } from "react";
import { Heart, ShoppingBag, Minus, Plus, Star, Truck, RefreshCw, Shield, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface ProductVariant {
    id: string;
    name: string;
    sku: string | null;
    size: string | null;
    color: string | null;
    colorHex: string | null;
    price: number | null;
    stockQuantity: number;
    image: string | null;
}

interface ProductDetailClientProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        compareAtPrice: number | null;
        description: string | null;
        shortDescription: string | null;
        sizeChart: string | null;
        fabricInfo: string | null;
        careInstructions: string | null;
        measurements: string | null;
        reassuranceText: string | null;
        deliveryInfo: string | null;
        isNew: boolean;
        variants: ProductVariant[];
        images: { url: string; alt?: string }[];
        rating: number;
        reviewCount: number;
    };
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    const addToCart = useCartStore((state) => state.addItem);
    const openCart = useCartStore((state) => state.openCart);
    const { isInWishlist, toggleItem } = useWishlistStore();

    const inWishlist = isInWishlist(product.id);

    // Get unique sizes and colors from variants
    const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))] as string[];
    const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))] as string[];
    const colorHexMap = product.variants.reduce((acc, v) => {
        if (v.color && v.colorHex) acc[v.color] = v.colorHex;
        return acc;
    }, {} as Record<string, string>);

    // Get selected variant
    const selectedVariant = product.variants.find(
        (v) => v.size === selectedSize && v.color === selectedColor
    );

    const currentPrice = selectedVariant?.price ?? product.price;
    const discount = product.compareAtPrice
        ? Math.round((1 - product.price / product.compareAtPrice) * 100)
        : 0;

    const handleAddToCart = () => {
        if (sizes.length > 0 && !selectedSize) {
            toast.error("Please select a size");
            return;
        }
        if (colors.length > 0 && !selectedColor) {
            toast.error("Please select a color");
            return;
        }

        addToCart({
            productId: product.id,
            variantId: selectedVariant?.id,
            name: product.name,
            variantName: [selectedSize, selectedColor].filter(Boolean).join(" / ") || undefined,
            price: currentPrice,
            image: product.images[0]?.url || "",
            quantity,
            size: selectedSize || undefined,
            color: selectedColor || undefined,
        });

        toast.success("Added to cart!");
        openCart();
    };

    const handleToggleWishlist = () => {
        toggleItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            compareAtPrice: product.compareAtPrice || undefined,
            image: product.images[0]?.url || "",
            slug: product.slug,
        });
        toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
    };

    return (
        <div className="space-y-6">
            {/* Title & Price */}
            <div>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        {product.isNew && (
                            <span className="badge badge-new mb-2">NEW ARRIVAL</span>
                        )}
                        <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
                    </div>
                    <button
                        onClick={handleToggleWishlist}
                        className={`p-3 rounded-full transition-all ${inWishlist
                                ? "bg-pink-500 text-white"
                                : "bg-white/10 hover:bg-white/20"
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
                    </button>
                </div>

                {/* Rating */}
                {product.reviewCount > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(product.rating)
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-600"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-400">
                            ({product.reviewCount} reviews)
                        </span>
                    </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-3 mt-4">
                    <span className="text-3xl font-bold gradient-text">
                        {formatPrice(currentPrice)}
                    </span>
                    {product.compareAtPrice && (
                        <>
                            <span className="text-xl text-gray-500 line-through">
                                {formatPrice(product.compareAtPrice)}
                            </span>
                            <span className="badge badge-sale">-{discount}%</span>
                        </>
                    )}
                </div>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
                <p className="text-gray-300">{product.shortDescription}</p>
            )}

            {/* Color Selection */}
            {colors.length > 0 && (
                <div>
                    <label className="block text-sm font-medium mb-3">
                        Color: {selectedColor || "Select"}
                    </label>
                    <div className="flex gap-2">
                        {colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`relative w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color
                                        ? "border-purple-500 scale-110"
                                        : "border-transparent hover:scale-105"
                                    }`}
                                style={{ backgroundColor: colorHexMap[color] || "#888" }}
                                title={color}
                            >
                                {selectedColor === color && (
                                    <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium">
                            Size: {selectedSize || "Select"}
                        </label>
                        {product.sizeChart && (
                            <button className="text-sm text-purple-400 hover:text-purple-300">
                                Size Guide
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => {
                            const variant = product.variants.find(
                                (v) => v.size === size && (!selectedColor || v.color === selectedColor)
                            );
                            const inStock = variant ? variant.stockQuantity > 0 : true;

                            return (
                                <button
                                    key={size}
                                    onClick={() => inStock && setSelectedSize(size)}
                                    disabled={!inStock}
                                    className={`px-4 py-2 rounded-lg border transition-all ${selectedSize === size
                                            ? "border-purple-500 bg-purple-500/20 text-purple-400"
                                            : inStock
                                                ? "border-white/20 hover:border-white/40"
                                                : "border-white/10 text-gray-600 cursor-not-allowed line-through"
                                        }`}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4 pt-4">
                {/* Quantity */}
                <div className="flex items-center border border-white/20 rounded-xl">
                    <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="p-3 hover:bg-white/10 transition-colors"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="p-3 hover:bg-white/10 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {/* Add to Cart */}
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="flex-1 btn-gradient flex items-center justify-center gap-2"
                >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                </motion.button>
            </div>

            {/* Reassurance */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                <div className="flex flex-col items-center text-center">
                    <Truck className="w-5 h-5 text-purple-400 mb-2" />
                    <span className="text-xs text-gray-400">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center">
                    <RefreshCw className="w-5 h-5 text-purple-400 mb-2" />
                    <span className="text-xs text-gray-400">30-Day Returns</span>
                </div>
                <div className="flex flex-col items-center text-center">
                    <Shield className="w-5 h-5 text-purple-400 mb-2" />
                    <span className="text-xs text-gray-400">Secure Payment</span>
                </div>
            </div>

            {/* Custom Reassurance Text */}
            {product.reassuranceText && (
                <p className="text-sm text-gray-400 italic">{product.reassuranceText}</p>
            )}

            {/* Delivery Info */}
            {product.deliveryInfo && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Delivery Information
                    </h4>
                    <p className="text-sm text-gray-400">{product.deliveryInfo}</p>
                </div>
            )}
        </div>
    );
}
