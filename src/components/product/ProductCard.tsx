"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import toast from "react-hot-toast";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        compareAtPrice?: number;
        images: { url: string; alt?: string }[];
        isNew?: boolean;
        isSale?: boolean;
        rating?: number;
        reviewCount?: number;
    };
    onQuickView?: () => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const addToCart = useCartStore((state) => state.addItem);
    const { isInWishlist, toggleItem } = useWishlistStore();

    const inWishlist = isInWishlist(product.id);
    const discount = product.compareAtPrice
        ? Math.round((1 - product.price / product.compareAtPrice) * 100)
        : 0;

    const handleAddToCart = () => {
        addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0]?.url || "",
            quantity: 1,
        });
        toast.success("Added to cart!");
    };

    const handleToggleWishlist = () => {
        toggleItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            image: product.images[0]?.url || "",
            slug: product.slug,
        });
        toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="product-card group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setCurrentImageIndex(0);
            }}
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden">
                {/* Images */}
                <Link href={`/products/${product.slug}`}>
                    {product.images.map((image, index) => (
                        <Image
                            key={index}
                            src={image.url || "/placeholder-product.jpg"}
                            alt={image.alt || product.name}
                            fill
                            className={`object-cover transition-opacity duration-300 ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                                }`}
                        />
                    ))}
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                        <span className="badge badge-new">NEW</span>
                    )}
                    {discount > 0 && (
                        <span className="badge badge-sale">-{discount}%</span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleToggleWishlist}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all ${inWishlist
                            ? "bg-pink-500 text-white"
                            : "bg-black/50 text-white hover:bg-black/70"
                        }`}
                >
                    <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
                </button>

                {/* Image Navigation Dots */}
                {product.images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {product.images.slice(0, 5).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${index === currentImageIndex
                                        ? "bg-white w-4"
                                        : "bg-white/50 hover:bg-white/70"
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Hover Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                    className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent"
                >
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 py-2.5 px-4 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Add to Cart
                        </button>
                        {onQuickView && (
                            <button
                                onClick={onQuickView}
                                className="p-2.5 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <Link href={`/products/${product.slug}`}>
                    <h3 className="font-medium text-sm mb-1 hover:text-purple-400 transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                {product.rating !== undefined && (
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < Math.floor(product.rating!)
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-600"
                                        }`}
                                />
                            ))}
                        </div>
                        {product.reviewCount !== undefined && (
                            <span className="text-xs text-gray-400">({product.reviewCount})</span>
                        )}
                    </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-purple-400">
                        {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.compareAtPrice)}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// Product Grid Component
export function ProductGrid({ products }: { products: ProductCardProps["product"][] }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
