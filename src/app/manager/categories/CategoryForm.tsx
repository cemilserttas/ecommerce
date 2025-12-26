"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface CategoryFormProps {
    categories?: { id: string; name: string }[];
    category?: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        image: string | null;
        parentId: string | null;
        isActive: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
    };
}

export function CategoryForm({ categories = [], category }: CategoryFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: category?.name || "",
        slug: category?.slug || "",
        description: category?.description || "",
        image: category?.image || "",
        parentId: category?.parentId || "",
        isActive: category?.isActive ?? true,
        metaTitle: category?.metaTitle || "",
        metaDescription: category?.metaDescription || "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));

        if (name === "name" && !category) {
            setFormData((prev) => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"),
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(
                category ? `/api/manager/categories/${category.id}` : "/api/manager/categories",
                {
                    method: category ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to save category");
            }

            toast.success(category ? "Category updated!" : "Category created!");
            router.push("/manager/categories");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to save");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/manager/categories"
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {category ? "Edit Category" : "New Category"}
                        </h1>
                        <p className="text-gray-400 mt-1">
                            {category ? "Update category details" : "Create a new category"}
                        </p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-gradient flex items-center gap-2"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {category ? "Update" : "Create"} Category
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass rounded-xl p-6">
                        <h3 className="font-semibold mb-4">Category Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-base"
                                    placeholder="Women's Clothing"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="input-base"
                                    placeholder="womens-clothing"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="input-base"
                                    placeholder="Category description..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="input-base"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="glass rounded-xl p-6">
                        <h3 className="font-semibold mb-4">SEO</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Meta Title</label>
                                <input
                                    type="text"
                                    name="metaTitle"
                                    value={formData.metaTitle}
                                    onChange={handleChange}
                                    className="input-base"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Meta Description</label>
                                <textarea
                                    name="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={handleChange}
                                    rows={2}
                                    className="input-base"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="glass rounded-xl p-6">
                        <h3 className="font-semibold mb-4">Organization</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Parent Category</label>
                                <select
                                    name="parentId"
                                    value={formData.parentId}
                                    onChange={handleChange}
                                    className="input-base"
                                >
                                    <option value="">No parent (top-level)</option>
                                    {categories
                                        .filter((c) => c.id !== category?.id)
                                        .map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                </select>
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-600 bg-white/5 text-purple-500"
                                />
                                <span>Active</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
