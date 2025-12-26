"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Eye } from "lucide-react";
import toast from "react-hot-toast";

interface PageFormProps {
    page?: {
        id: string;
        title: string;
        slug: string;
        content: string | null;
        isPublished: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
    };
}

export function PageForm({ page }: PageFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: page?.title || "",
        slug: page?.slug || "",
        content: page?.content || "",
        isPublished: page?.isPublished ?? false,
        metaTitle: page?.metaTitle || "",
        metaDescription: page?.metaDescription || "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));

        if (name === "title" && !page) {
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
                page ? `/api/manager/pages/${page.id}` : "/api/manager/pages",
                {
                    method: page ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to save page");
            }

            toast.success(page ? "Page updated!" : "Page created!");
            router.push("/manager/pages");
            router.refresh();
        } catch (error) {
            toast.error("Failed to save page");
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
                        href="/manager/pages"
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{page ? "Edit Page" : "New Page"}</h1>
                        <p className="text-gray-400 mt-1">
                            {page ? "Update your static page" : "Create a new static page"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {page?.isPublished && (
                        <Link
                            href={`/pages/${page.slug}`}
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            Preview
                        </Link>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-gradient flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {page ? "Update" : "Create"} Page
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass rounded-xl p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="input-base"
                                    placeholder="About Us"
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
                                    placeholder="about-us"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows={20}
                                    className="input-base font-mono text-sm"
                                    placeholder="Page content... (HTML supported)"
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
                <div className="glass rounded-xl p-6 h-fit">
                    <h3 className="font-semibold mb-4">Status</h3>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-gray-600 bg-white/5 text-purple-500"
                        />
                        <span>Published</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                        {formData.isPublished ? "This page is visible" : "This page is a draft"}
                    </p>
                </div>
            </div>
        </form>
    );
}
