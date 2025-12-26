import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Plus, Edit, Trash2, Eye, FileText } from "lucide-react";

async function getBlogPosts() {
    try {
        return await prisma.blogPost.findMany({
            include: {
                author: { select: { firstName: true, lastName: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        return [];
    }
}

export default async function ManagerBlogPage() {
    const posts = await getBlogPosts();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Blog Posts</h1>
                    <p className="text-gray-400 mt-1">{posts.length} total posts</p>
                </div>
                <Link
                    href="/manager/blog/new"
                    className="btn-gradient flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Post
                </Link>
            </div>

            {/* Posts Table */}
            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                            <th className="px-6 py-4 font-medium">Title</th>
                            <th className="px-6 py-4 font-medium">Author</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr
                                key={post.id}
                                className="border-b border-white/5 hover:bg-white/5"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                                            {post.featuredImage ? (
                                                <img
                                                    src={post.featuredImage}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FileText className="w-5 h-5 text-gray-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium truncate">{post.title}</p>
                                            <p className="text-sm text-gray-400 truncate">/{post.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                    {post.author.firstName} {post.author.lastName}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${post.isPublished
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-yellow-500/20 text-yellow-400"
                                            }`}
                                    >
                                        {post.isPublished ? "Published" : "Draft"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm">
                                    {post.publishedAt
                                        ? formatDate(post.publishedAt)
                                        : formatDate(post.createdAt)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {post.isPublished && (
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                target="_blank"
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        )}
                                        <Link
                                            href={`/manager/blog/${post.id}`}
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

                {posts.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 mb-4">No blog posts yet</p>
                        <Link href="/manager/blog/new" className="btn-gradient">
                            Create Your First Post
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
