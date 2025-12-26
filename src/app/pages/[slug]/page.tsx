import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface StaticPageProps {
    params: Promise<{ slug: string }>;
}

async function getPage(slug: string) {
    try {
        return await prisma.page.findUnique({
            where: { slug, isPublished: true },
        });
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }: StaticPageProps): Promise<Metadata> {
    const { slug } = await params;
    const page = await getPage(slug);

    if (!page) {
        return { title: "Page Not Found" };
    }

    return {
        title: page.metaTitle || `${page.title} | LUXE`,
        description: page.metaDescription || undefined,
    };
}

export default async function StaticPage({ params }: StaticPageProps) {
    const { slug } = await params;
    const page = await getPage(slug);

    if (!page) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-32 pb-20">
                <div className="container-custom max-w-4xl">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8">{page.title}</h1>

                    <div
                        className="prose prose-invert prose-lg max-w-none
              prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-gray-300 prose-p:leading-relaxed
              prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-ul:text-gray-300 prose-ol:text-gray-300
            "
                        dangerouslySetInnerHTML={{ __html: page.content || "" }}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
