import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

interface SuccessPageProps {
    searchParams: Promise<{ session_id?: string }>;
}

async function getOrder(sessionId: string) {
    try {
        const order = await prisma.order.findFirst({
            where: { stripeSessionId: sessionId },
            include: {
                items: {
                    include: {
                        product: { select: { slug: true } },
                    },
                },
            },
        });

        if (order) {
            return {
                ...order,
                total: Number(order.total),
                subtotal: Number(order.subtotal),
                discountAmount: Number(order.discountAmount),
                shippingCost: Number(order.shippingCost),
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching order:", error);
        return null;
    }
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
    const params = await searchParams;

    if (!params.session_id) {
        redirect("/");
    }

    const order = await getOrder(params.session_id);

    if (!order) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-32 pb-20">
                <div className="container-custom max-w-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
                            <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
                        <p className="text-gray-400">Your order has been placed successfully.</p>
                    </div>

                    <div className="glass rounded-2xl p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-400">Order Number</p>
                                <p className="font-semibold text-lg">{order.orderNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-400">Total</p>
                                <p className="font-semibold text-lg gradient-text">
                                    {formatPrice(order.total)}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-4 mt-4">
                            <h3 className="font-medium mb-3">Order Items</h3>
                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <div>
                                            <span>{item.productName}</span>
                                            {item.variantName && (
                                                <span className="text-gray-400"> - {item.variantName}</span>
                                            )}
                                            <span className="text-gray-400"> × {item.quantity}</span>
                                        </div>
                                        <span>{formatPrice(Number(item.price) * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {order.discountAmount > 0 && (
                            <div className="flex justify-between text-sm text-green-400 mt-3">
                                <span>Discount</span>
                                <span>-{formatPrice(order.discountAmount)}</span>
                            </div>
                        )}
                    </div>

                    <div className="glass rounded-2xl p-6 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-purple-500/20">
                                <Package className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-medium">What&apos;s Next?</h3>
                                <p className="text-sm text-gray-400">
                                    We&apos;ll send you a confirmation email with tracking information once your order ships.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/account/orders"
                            className="btn-gradient inline-flex items-center justify-center gap-2"
                        >
                            View Order
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/products"
                            className="px-6 py-3 border border-white/20 rounded-xl text-center hover:bg-white/10 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
