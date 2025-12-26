import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";

// Mock featured products for initial display
const featuredProducts = [
  {
    id: "1",
    name: "Premium Wool Overcoat",
    slug: "premium-wool-overcoat",
    price: 299.99,
    compareAtPrice: 399.99,
    images: [{ url: "/placeholder-product.jpg", alt: "Wool Overcoat" }],
    isNew: true,
  },
  {
    id: "2",
    name: "Cashmere Sweater",
    slug: "cashmere-sweater",
    price: 189.99,
    images: [{ url: "/placeholder-product.jpg", alt: "Cashmere Sweater" }],
    rating: 4.5,
    reviewCount: 127,
  },
  {
    id: "3",
    name: "Slim Fit Jeans",
    slug: "slim-fit-jeans",
    price: 89.99,
    compareAtPrice: 120.00,
    images: [{ url: "/placeholder-product.jpg", alt: "Slim Fit Jeans" }],
    isSale: true,
  },
  {
    id: "4",
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    price: 159.99,
    images: [{ url: "/placeholder-product.jpg", alt: "Leather Bag" }],
    isNew: true,
  },
];

const categories = [
  { name: "Women", image: "/placeholder-category.jpg", href: "/products?category=women" },
  { name: "Men", image: "/placeholder-category.jpg", href: "/products?category=men" },
  { name: "Accessories", image: "/placeholder-category.jpg", href: "/products?category=accessories" },
  { name: "New In", image: "/placeholder-category.jpg", href: "/products?filter=new" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-background to-pink-900/30" />

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="container-custom relative z-10 text-center py-32">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm">New Winter Collection 2024</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span className="gradient-text">Elevate</span> Your
              <br />
              <span className="text-white">Style Game</span>
            </h1>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Discover curated fashion pieces that define modern elegance.
              Premium quality, timeless designs, delivered to your door.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products"
                className="btn-gradient px-8 py-4 text-lg flex items-center gap-2"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/products?filter=new"
                className="px-8 py-4 text-lg border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
              >
                View New Arrivals
              </Link>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-background-secondary">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
              <p className="text-gray-400">Explore our curated collections</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute inset-0 bg-purple-900/50 transition-opacity group-hover:opacity-0" />
                  <div className="absolute inset-0 flex items-end p-6 z-20">
                    <div>
                      <h3 className="text-xl font-semibold mb-1 group-hover:text-purple-400 transition-colors">
                        {category.name}
                      </h3>
                      <span className="text-sm text-gray-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Shop Now <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
                <p className="text-gray-400">Handpicked favorites just for you</p>
              </div>
              <Link
                href="/products"
                className="hidden md:flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card group">
                  <div className="relative aspect-[3/4] rounded-t-xl overflow-hidden bg-gray-800">
                    {product.isNew && (
                      <span className="absolute top-3 left-3 z-10 badge badge-new">NEW</span>
                    )}
                    {product.compareAtPrice && (
                      <span className="absolute top-3 left-3 z-10 badge badge-sale">
                        -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm mb-2 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-purple-400">${product.price}</span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.compareAtPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link href="/products" className="btn-gradient inline-flex items-center gap-2">
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background-secondary">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Fast Shipping</h3>
                <p className="text-gray-400">
                  Free express delivery on orders over $100. Get your items within 2-3 business days.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20">
                <div className="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
                <p className="text-gray-400">
                  Every piece is crafted with premium materials and attention to detail.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Trend-Forward</h3>
                <p className="text-gray-400">
                  Stay ahead of the curve with our carefully curated seasonal collections.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20">
          <div className="container-custom">
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600" />
              <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />

              <div className="relative z-10 px-8 py-16 md:py-24 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  Join the LUXE Family
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                  Subscribe to our newsletter and get 15% off your first order,
                  plus exclusive access to new arrivals and sales.
                </p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
