import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye } from "lucide-react";

async function getProducts(params: {
    search?: string;
    category?: string;
    page?: number;
}) {
    try {
        const where: any = {};

        if (params.search) {
            where.OR = [
                { name: { contains: params.search, mode: "insensitive" } },
                { sku: { contains: params.search, mode: "insensitive" } },
            ];
        }

        if (params.category) {
            where.categoryId = params.category;
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                category: true,
                images: { take: 1, orderBy: { sortOrder: "asc" } },
            },
            orderBy: { createdAt: "desc" },
            take: 20,
            skip: ((params.page || 1) - 1) * 20,
        });

        const total = await prisma.product.count({ where });

        return { products, total };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { products: [], total: 0 };
    }
}

async function getCategories() {
    try {
        return await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { name: "asc" },
        });
    } catch (error) {
        return [];
    }
}

export default async function ProductsPage() {
    const { products, total } = await getProducts({});
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Products</h1>
                    <p className="text-gray-400 mt-1">{total} products in catalog</p>
                </div>
                <Link
                    href="/manager/products/new"
                    className="btn-gradient flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="glass rounded-xl p-4 flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Products Table */}
            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                            <th className="px-6 py-4 font-medium">Product</th>
                            <th className="px-6 py-4 font-medium">Category</th>
                            <th className="px-6 py-4 font-medium">Price</th>
                            <th className="px-6 py-4 font-medium">Stock</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="border-b border-white/5 hover:bg-white/5"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden">
                                            {product.images[0] && (
                                                <img
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-gray-400">{product.sku || "No SKU"}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                    {product.category?.name || "-"}
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium">{formatPrice(Number(product.price))}</p>
                                        {product.compareAtPrice && (
                                            <p className="text-sm text-gray-400 line-through">
                                                {formatPrice(Number(product.compareAtPrice))}
                                            </p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`${product.stockQuantity <= 5
                                                ? "text-red-400"
                                                : product.stockQuantity <= 20
                                                    ? "text-yellow-400"
                                                    : "text-green-400"
                                            }`}
                                    >
                                        {product.stockQuantity}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex px-2 py-1 rounded text-xs font-medium ${product.isActive
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-gray-500/20 text-gray-400"
                                            }`}
                                    >
                                        {product.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/products/${product.slug}`}
                                            target="_blank"
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            title="View"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={`/manager/products/${product.id}`}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 mb-4">No products found</p>
                        <Link href="/manager/products/new" className="btn-gradient">
                            Add Your First Product
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
