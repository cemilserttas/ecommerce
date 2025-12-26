"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Plus, X, Upload } from "lucide-react";
import toast from "react-hot-toast";

interface Category {
    id: string;
    name: string;
}

interface ProductFormProps {
    categories: Category[];
    product?: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        shortDescription: string | null;
        price: number;
        compareAtPrice: number | null;
        sku: string | null;
        stockQuantity: number;
        categoryId: string | null;
        isActive: boolean;
        isNew: boolean;
        isFeatured: boolean;
        fabricInfo: string | null;
        careInstructions: string | null;
        sizeChart: string | null;
        measurements: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        images: { id: string; url: string; alt: string | null }[];
    };
}

export function ProductForm({ categories, product }: ProductFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: product?.name || "",
        slug: product?.slug || "",
        description: product?.description || "",
        shortDescription: product?.shortDescription || "",
        price: product?.price || 0,
        compareAtPrice: product?.compareAtPrice || "",
        sku: product?.sku || "",
        stockQuantity: product?.stockQuantity || 0,
        categoryId: product?.categoryId || "",
        isActive: product?.isActive ?? true,
        isNew: product?.isNew ?? false,
        isFeatured: product?.isFeatured ?? false,
        fabricInfo: product?.fabricInfo || "",
        careInstructions: product?.careInstructions || "",
        sizeChart: product?.sizeChart || "",
        measurements: product?.measurements || "",
        metaTitle: product?.metaTitle || "",
        metaDescription: product?.metaDescription || "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));

        // Auto-generate slug from name
        if (name === "name" && !product) {
            setFormData((prev) => ({
                ...prev,
                slug: value
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/\s+/g, "-"),
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(
                product ? `/api/manager/products/${product.id}` : "/api/manager/products",
                {
                    method: product ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to save product");
            }

            toast.success(product ? "Product updated!" : "Product created!");
            router.push("/manager/products");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to save product");
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
                        href="/manager/products"
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {product ? "Edit Product" : "New Product"}
                        </h1>
                        <p className="text-gray-400 mt-1">
                            {product ? "Update product information" : "Add a new product to your catalog"}
                        </p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-gradient flex items-center gap-2"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {product ? "Update" : "Create"} Product
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="font-semibold mb-4">Basic Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-base"
                                    placeholder="Premium Cotton T-Shirt"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="input-base"
                                    placeholder="premium-cotton-t-shirt"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Short Description
                                </label>
                                <textarea
                                    name="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={handleChange}
                                    rows={2}
                                    className="input-base"
                                    placeholder="Brief product description..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Full Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={6}
                                    className="input-base"
                                    placeholder="Detailed product description..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="font-semibold mb-4">Pricing & Inventory</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Price *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className="input-base"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Compare at Price
                                </label>
                                <input
                                    type="number"
                                    name="compareAtPrice"
                                    value={formData.compareAtPrice}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className="input-base"
                                    placeholder="Original price for sale items"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    SKU
                                </label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    className="input-base"
                                    placeholder="Product SKU"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Stock Quantity
                                </label>
                                <input
                                    type="number"
                                    name="stockQuantity"
                                    value={formData.stockQuantity}
                                    onChange={handleChange}
                                    min="0"
                                    className="input-base"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Clothing Details */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="font-semibold mb-4">Clothing Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Fabric Information
                                </label>
                                <input
                                    type="text"
                                    name="fabricInfo"
                                    value={formData.fabricInfo}
                                    onChange={handleChange}
                                    className="input-base"
                                    placeholder="100% Cotton, Organic..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Care Instructions
                                </label>
                                <textarea
                                    name="careInstructions"
                                    value={formData.careInstructions}
                                    onChange={handleChange}
                                    rows={2}
                                    className="input-base"
                                    placeholder="Machine wash cold, tumble dry low..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Size Chart (JSON)
                                </label>
                                <textarea
                                    name="sizeChart"
                                    value={formData.sizeChart}
                                    onChange={handleChange}
                                    rows={3}
                                    className="input-base font-mono text-sm"
                                    placeholder='{"S": {"chest": "36"}, "M": {"chest": "38"}}'
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Measurements (JSON)
                                </label>
                                <textarea
                                    name="measurements"
                                    value={formData.measurements}
                                    onChange={handleChange}
                                    rows={3}
                                    className="input-base font-mono text-sm"
                                    placeholder='{"length": "28in", "width": "20in"}'
                                />
                            </div>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="font-semibold mb-4">SEO</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    name="metaTitle"
                                    value={formData.metaTitle}
                                    onChange={handleChange}
                                    className="input-base"
                                    placeholder="Product Title | LUXE"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Meta Description
                                </label>
                                <textarea
                                    name="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={handleChange}
                                    rows={2}
                                    className="input-base"
                                    placeholder="SEO description for search engines..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="font-semibold mb-4">Status</h2>
                        <div className="space-y-4">
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

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isNew"
                                    checked={formData.isNew}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-600 bg-white/5 text-purple-500"
                                />
                                <span>Mark as New</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-600 bg-white/5 text-purple-500"
                                />
                                <span>Featured</span>
                            </label>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="font-semibold mb-4">Category</h2>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="input-base"
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Images */}
                    <div className="glass rounded-xl p-6">
                        <h2 className="font-semibold mb-4">Images</h2>
                        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-400">
                                Drag & drop images or click to upload
                            </p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
