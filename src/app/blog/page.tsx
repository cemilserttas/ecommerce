import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Calendar, User, ArrowRight } from "lucide-react";

async function getBlogPosts() {
    try {
        const posts = await prisma.blogPost.findMany({
            where: { isPublished: true },
            include: {
                author: { select: { firstName: true, lastName: true } },
            },
            orderBy: { publishedAt: "desc" },
        });
        return posts;
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return [];
    }
}

export default async function BlogPage() {
    const posts = await getBlogPosts();

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-32 pb-20">
                <div className="container-custom">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="gradient-text">Style</span> Journal
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Fashion tips, trends, and stories from our team. Stay inspired and elevate your wardrobe.
                        </p>
                    </div>

                    {/* Posts Grid */}
                    {posts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-400">No blog posts yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post, index) => (
                                <article
                                    key={post.id}
                                    className={`glass rounded-2xl overflow-hidden group ${index === 0 ? "md:col-span-2 lg:col-span-2" : ""
                                        }`}
                                >
                                    {/* Featured Image */}
                                    <Link href={`/blog/${post.slug}`} className="block relative aspect-video">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30" />
                                        {post.featuredImage && (
                                            <img
                                                src={post.featuredImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        )}
                                    </Link>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                {post.author.firstName} {post.author.lastName}
                                            </span>
                                        </div>

                                        <Link href={`/blog/${post.slug}`}>
                                            <h2 className={`font-bold mb-2 hover:text-purple-400 transition-colors ${index === 0 ? "text-2xl" : "text-lg"
                                                }`}>
                                                {post.title}
                                            </h2>
                                        </Link>

                                        {post.excerpt && (
                                            <p className="text-gray-400 line-clamp-2 mb-4">{post.excerpt}</p>
                                        )}

                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                                        >
                                            Read More <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
