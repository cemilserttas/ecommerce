import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
    try {
        const post = await prisma.blogPost.findUnique({
            where: { slug, isPublished: true },
            include: {
                author: { select: { firstName: true, lastName: true } },
            },
        });
        return post;
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return { title: "Post Not Found" };
    }

    return {
        title: post.metaTitle || `${post.title} | LUXE Blog`,
        description: post.metaDescription || post.excerpt || undefined,
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-32 pb-20">
                <article className="container-custom max-w-4xl">
                    {/* Back Link */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>

                    {/* Header */}
                    <header className="mb-8">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-4 text-gray-400">
                            <span className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {post.author.firstName} {post.author.lastName}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
                            </span>
                        </div>
                    </header>

                    {/* Featured Image */}
                    {post.featuredImage && (
                        <div className="rounded-2xl overflow-hidden mb-8">
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full aspect-video object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className="prose prose-invert prose-lg max-w-none
              prose-headings:font-bold]
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-gray-300 prose-p:leading-relaxed
              prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-ul:text-gray-300 prose-ol:text-gray-300
              prose-blockquote:border-purple-500 prose-blockquote:bg-white/5 prose-blockquote:rounded-r-xl prose-blockquote:py-2
            "
                        dangerouslySetInnerHTML={{ __html: post.content || "" }}
                    />

                    {/* Share Section */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <p className="text-gray-400 mb-4">Share this article</p>
                        <div className="flex gap-3">
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://yoursite.com/blog/${post.slug}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                Twitter
                            </a>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://yoursite.com/blog/${post.slug}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                Facebook
                            </a>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
