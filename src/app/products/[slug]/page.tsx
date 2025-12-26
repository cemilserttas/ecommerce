import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ImageGallery } from "@/components/product/ImageGallery";
import { ProductDetailClient } from "./ProductDetailClient";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { slug, isActive: true },
            include: {
                images: { orderBy: { sortOrder: "asc" } },
                variants: { where: { isActive: true }, orderBy: { name: "asc" } },
                category: true,
                reviews: {
                    where: { isApproved: true },
                    include: { user: { select: { firstName: true, lastName: true } } },
                    orderBy: { createdAt: "desc" },
                    take: 10,
                },
            },
        });

        if (!product) return null;

        return {
            ...product,
            price: Number(product.price),
            compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
            variants: product.variants.map((v) => ({
                ...v,
                price: v.price ? Number(v.price) : null,
            })),
        };
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return { title: "Product Not Found" };
    }

    return {
        title: product.metaTitle || `${product.name} | LUXE`,
        description: product.metaDescription || product.shortDescription || product.description?.slice(0, 160),
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    const images = product.images.length > 0
        ? product.images.map((img) => ({ url: img.url, alt: img.alt || undefined }))
        : [{ url: "/placeholder-product.jpg", alt: product.name }];

    const averageRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <CartDrawer />

            <main className="pt-32 pb-20">
                <div className="container-custom">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-white">Products</Link>
                        {product.category && (
                            <>
                                <span>/</span>
                                <Link
                                    href={`/products?category=${product.category.slug}`}
                                    className="hover:text-white"
                                >
                                    {product.category.name}
                                </Link>
                            </>
                        )}
                        <span>/</span>
                        <span className="text-white truncate max-w-[200px]">{product.name}</span>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Image Gallery */}
                        <div>
                            <ImageGallery images={images} productName={product.name} />
                        </div>

                        {/* Product Info - Client Component */}
                        <ProductDetailClient
                            product={{
                                id: product.id,
                                name: product.name,
                                slug: product.slug,
                                price: product.price,
                                compareAtPrice: product.compareAtPrice,
                                description: product.description,
                                shortDescription: product.shortDescription,
                                sizeChart: product.sizeChart,
                                fabricInfo: product.fabricInfo,
                                careInstructions: product.careInstructions,
                                measurements: product.measurements,
                                reassuranceText: product.reassuranceText,
                                deliveryInfo: product.deliveryInfo,
                                isNew: product.isNew,
                                variants: product.variants,
                                images: images,
                                rating: averageRating,
                                reviewCount: product.reviews.length,
                            }}
                        />
                    </div>

                    {/* Product Details Tabs */}
                    <div className="mt-16">
                        <div className="border-b border-white/10 mb-8">
                            <div className="flex gap-8">
                                <button className="pb-3 border-b-2 border-purple-500 text-purple-400 font-medium">
                                    Description
                                </button>
                                <button className="pb-3 border-b-2 border-transparent text-gray-400 hover:text-white">
                                    Size Guide
                                </button>
                                <button className="pb-3 border-b-2 border-transparent text-gray-400 hover:text-white">
                                    Reviews ({product.reviews.length})
                                </button>
                            </div>
                        </div>

                        <div className="prose prose-invert max-w-none">
                            {product.description ? (
                                <div dangerouslySetInnerHTML={{ __html: product.description }} />
                            ) : (
                                <p className="text-gray-400">No description available.</p>
                            )}

                            {product.fabricInfo && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-3">Fabric & Materials</h3>
                                    <p className="text-gray-300">{product.fabricInfo}</p>
                                </div>
                            )}

                            {product.careInstructions && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold mb-3">Care Instructions</h3>
                                    <p className="text-gray-300">{product.careInstructions}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
