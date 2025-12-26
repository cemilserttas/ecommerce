import Link from "next/link";
import prisma from "@/lib/prisma";
import { Plus, Edit, Trash2, Folder, GripVertical } from "lucide-react";

async function getCategories() {
    try {
        return await prisma.category.findMany({
            include: {
                _count: { select: { products: true } },
                parent: { select: { name: true } },
            },
            orderBy: { sortOrder: "asc" },
        });
    } catch (error) {
        return [];
    }
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <p className="text-gray-400 mt-1">{categories.length} categories</p>
                </div>
                <Link
                    href="/manager/categories/new"
                    className="btn-gradient flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Category
                </Link>
            </div>

            {/* Categories Table */}
            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                            <th className="px-6 py-4 font-medium w-12"></th>
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Slug</th>
                            <th className="px-6 py-4 font-medium">Parent</th>
                            <th className="px-6 py-4 font-medium">Products</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr
                                key={category.id}
                                className="border-b border-white/5 hover:bg-white/5"
                            >
                                <td className="px-6 py-4">
                                    <GripVertical className="w-4 h-4 text-gray-500 cursor-grab" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-purple-500/20">
                                            <Folder className="w-4 h-4 text-purple-400" />
                                        </div>
                                        <span className="font-medium">{category.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-400 font-mono text-sm">
                                    /{category.slug}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                    {category.parent?.name || "-"}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded bg-white/10 text-sm">
                                        {category._count.products}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${category.isActive
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-gray-500/20 text-gray-400"
                                            }`}
                                    >
                                        {category.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/manager/categories/${category.id}`}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {categories.length === 0 && (
                    <div className="text-center py-12">
                        <Folder className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 mb-4">No categories yet</p>
                        <Link href="/manager/categories/new" className="btn-gradient">
                            Create Your First Category
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
