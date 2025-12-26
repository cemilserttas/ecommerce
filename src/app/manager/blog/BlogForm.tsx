"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Eye } from "lucide-react";
import toast from "react-hot-toast";

interface BlogFormProps {
    post?: {
        id: string;
        title: string;
        slug: string;
        content: string | null;
        excerpt: string | null;
        featuredImage: string | null;
        isPublished: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
    };
}

export function BlogForm({ post }: BlogFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        excerpt: post?.excerpt || "",
        featuredImage: post?.featuredImage || "",
        isPublished: post?.isPublished ?? false,
        metaTitle: post?.metaTitle || "",
        metaDescription: post?.metaDescription || "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));

        if (name === "title" && !post) {
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
                post ? `/api/manager/blog/${post.id}` : "/api/manager/blog",
                {
                    method: post ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to save post");
            }

            toast.success(post ? "Post updated!" : "Post created!");
            router.push("/manager/blog");
            router.refresh();
        } catch (error) {
            toast.error("Failed to save post");
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
                        href="/manager/blog"
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {post ? "Edit Post" : "New Post"}
                        </h1>
                        <p className="text-gray-400 mt-1">
                            {post ? "Update your blog post" : "Create a new blog post"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {post?.isPublished && (
                        <Link
                            href={`/blog/${post.slug}`}
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
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {post ? "Update" : "Create"} Post
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass rounded-xl p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="input-base"
                                    placeholder="10 Fashion Trends for 2024"
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
                                    placeholder="10-fashion-trends-2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Excerpt
                                </label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    rows={2}
                                    className="input-base"
                                    placeholder="A brief summary that appears in listings..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Content
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows={20}
                                    className="input-base font-mono text-sm"
                                    placeholder="Write your blog post content here... (HTML supported)"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    You can use HTML tags for formatting
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="glass rounded-xl p-6">
                        <h3 className="font-semibold mb-4">SEO</h3>
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
                                    placeholder="SEO title (defaults to post title)"
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
                    <div className="glass rounded-xl p-6">
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
                            {formData.isPublished
                                ? "This post is visible to the public"
                                : "This post is saved as a draft"}
                        </p>
                    </div>

                    <div className="glass rounded-xl p-6">
                        <h3 className="font-semibold mb-4">Featured Image</h3>
                        <input
                            type="text"
                            name="featuredImage"
                            value={formData.featuredImage}
                            onChange={handleChange}
                            className="input-base mb-3"
                            placeholder="https://example.com/image.jpg"
                        />
                        {formData.featuredImage && (
                            <img
                                src={formData.featuredImage}
                                alt="Featured"
                                className="w-full aspect-video object-cover rounded-lg"
                            />
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}
