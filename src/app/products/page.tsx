import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import prisma from "@/lib/prisma";
import { ProductCard, ProductGrid } from "@/components/product/ProductCard";
import Link from "next/link";
import { SlidersHorizontal, Grid3X3, List, ChevronDown } from "lucide-react";

interface ProductsPageProps {
    searchParams: Promise<{
        category?: string;
        filter?: string;
        sort?: string;
        page?: string;
        search?: string;
    }>;
}

async function getProducts(params: {
    category?: string;
    filter?: string;
    sort?: string;
    page?: string;
    search?: string;
}) {
    try {
        const where: any = { isActive: true };

        if (params.category) {
            where.category = { slug: params.category };
        }

        if (params.filter === "new") {
            where.isNew = true;
        } else if (params.filter === "sale") {
            where.compareAtPrice = { not: null };
        }

        if (params.search) {
            where.OR = [
                { name: { contains: params.search, mode: "insensitive" } },
                { description: { contains: params.search, mode: "insensitive" } },
            ];
        }

        let orderBy: any = { createdAt: "desc" };
        if (params.sort === "price-asc") {
            orderBy = { price: "asc" };
        } else if (params.sort === "price-desc") {
            orderBy = { price: "desc" };
        } else if (params.sort === "name") {
            orderBy = { name: "asc" };
        }

        const products = await prisma.product.findMany({
            where,
            orderBy,
            include: {
                images: { orderBy: { sortOrder: "asc" }, take: 4 },
                category: true,
            },
            take: 20,
        });

        return products.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: Number(p.price),
            compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
            images: p.images.map((img) => ({ url: img.url, alt: img.alt || undefined })),
            isNew: p.isNew,
            isSale: !!p.compareAtPrice,
        }));
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

async function getCategories() {
    try {
        return await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const params = await searchParams;
    const products = await getProducts(params);
    const categories = await getCategories();

    const getTitle = () => {
        if (params.filter === "new") return "New Arrivals";
        if (params.filter === "sale") return "Sale";
        if (params.category) {
            const cat = categories.find((c) => c.slug === params.category);
            return cat?.name || "Products";
        }
        return "All Products";
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <CartDrawer />

            <main className="pt-32 pb-20">
                <div className="container-custom">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                        <Link href="/" className="hover:text-white">
                            Home
                        </Link>
                        <span>/</span>
                        <span className="text-white">{getTitle()}</span>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <aside className="lg:w-64 flex-shrink-0">
                            <div className="glass rounded-2xl p-6 sticky top-32">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Filters
                                </h3>

                                {/* Categories */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-400 mb-3">
                                        Categories
                                    </h4>
                                    <div className="space-y-2">
                                        <Link
                                            href="/products"
                                            className={`block py-2 px-3 rounded-lg transition-colors ${!params.category
                                                    ? "bg-purple-500/20 text-purple-400"
                                                    : "hover:bg-white/5"
                                                }`}
                                        >
                                            All Products
                                        </Link>
                                        {categories.map((category) => (
                                            <Link
                                                key={category.id}
                                                href={`/products?category=${category.slug}`}
                                                className={`block py-2 px-3 rounded-lg transition-colors ${params.category === category.slug
                                                        ? "bg-purple-500/20 text-purple-400"
                                                        : "hover:bg-white/5"
                                                    }`}
                                            >
                                                {category.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Filters */}
                                <div className="border-t border-white/10 pt-6">
                                    <h4 className="text-sm font-medium text-gray-400 mb-3">
                                        Quick Filters
                                    </h4>
                                    <div className="space-y-2">
                                        <Link
                                            href="/products?filter=new"
                                            className={`block py-2 px-3 rounded-lg transition-colors ${params.filter === "new"
                                                    ? "bg-purple-500/20 text-purple-400"
                                                    : "hover:bg-white/5"
                                                }`}
                                        >
                                            New Arrivals
                                        </Link>
                                        <Link
                                            href="/products?filter=sale"
                                            className={`block py-2 px-3 rounded-lg transition-colors ${params.filter === "sale"
                                                    ? "bg-pink-500/20 text-pink-400"
                                                    : "hover:bg-white/5"
                                                }`}
                                        >
                                            On Sale
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Products Grid */}
                        <div className="flex-1">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold">{getTitle()}</h1>
                                    <p className="text-gray-400 mt-1">
                                        {products.length} products
                                    </p>
                                </div>

                                {/* Sort */}
                                <div className="relative">
                                    <select
                                        defaultValue={params.sort || "newest"}
                                        className="appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        onChange={(e) => {
                                            const url = new URL(window.location.href);
                                            url.searchParams.set("sort", e.target.value);
                                            window.location.href = url.toString();
                                        }}
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="price-asc">Price: Low to High</option>
                                        <option value="price-desc">Price: High to Low</option>
                                        <option value="name">Name</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                                </div>
                            </div>

                            {/* Products */}
                            {products.length > 0 ? (
                                <ProductGrid products={products} />
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-gray-400 mb-4">No products found</p>
                                    <Link href="/products" className="btn-gradient">
                                        View All Products
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
