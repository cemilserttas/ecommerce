import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, ArrowLeft, MapPin, CreditCard, Truck } from "lucide-react";
import { notFound } from "next/navigation";

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

async function getOrder(orderId: string, userId: string) {
    try {
        const order = await prisma.order.findFirst({
            where: { id: orderId, userId },
            include: {
                items: {
                    include: {
                        product: { select: { slug: true } },
                    },
                },
                promoCode: true,
            },
        });

        if (!order) return null;

        return {
            ...order,
            total: Number(order.total),
            subtotal: Number(order.subtotal),
            discountAmount: Number(order.discountAmount),
            shippingCost: Number(order.shippingCost),
            taxAmount: Number(order.taxAmount),
        };
    } catch (error) {
        console.error("Error fetching order:", error);
        return null;
    }
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        PENDING: "bg-yellow-500/20 text-yellow-400",
        CONFIRMED: "bg-blue-500/20 text-blue-400",
        PROCESSING: "bg-purple-500/20 text-purple-400",
        SHIPPED: "bg-cyan-500/20 text-cyan-400",
        DELIVERED: "bg-green-500/20 text-green-400",
        CANCELLED: "bg-red-500/20 text-red-400",
        REFUNDED: "bg-gray-500/20 text-gray-400",
    };

    return (
        <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${colors[status] || colors.PENDING}`}>
            {status}
        </span>
    );
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const order = await getOrder(id, session!.user.id);

    if (!order) {
        notFound();
    }

    const shippingInfo = order.shippingInfo as any;
    const billingInfo = order.billingInfo as any;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/account/orders"
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
                    <p className="text-gray-400 mt-1">
                        Placed on {formatDate(order.createdAt)}
                    </p>
                </div>
                <StatusBadge status={order.status} />
            </div>

            {/* Order Timeline */}
            {order.status !== "CANCELLED" && (
                <div className="glass rounded-2xl p-6">
                    <h3 className="font-semibold mb-4">Order Status</h3>
                    <div className="flex items-center justify-between">
                        {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].map((step, index) => {
                            const statusOrder = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
                            const currentIndex = statusOrder.indexOf(order.status);
                            const isComplete = index <= currentIndex;
                            const isCurrent = step === order.status;

                            return (
                                <div key={step} className="flex-1 relative">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${isComplete
                                                    ? "bg-purple-500"
                                                    : "bg-white/10 border border-white/20"
                                                }`}
                                        >
                                            {isComplete && (
                                                <span className="text-xs">✓</span>
                                            )}
                                        </div>
                                        <span className={`text-xs mt-2 ${isCurrent ? "text-purple-400" : "text-gray-500"}`}>
                                            {step}
                                        </span>
                                    </div>
                                    {index < 4 && (
                                        <div
                                            className={`absolute top-4 left-1/2 w-full h-0.5 ${index < currentIndex ? "bg-purple-500" : "bg-white/10"
                                                }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2">
                    <div className="glass rounded-2xl p-6">
                        <h3 className="font-semibold mb-4">Order Items</h3>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                                    <div className="relative w-20 h-20 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                                        {item.productImage ? (
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-6 h-6 text-gray-600" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/products/${item.product?.slug || item.productId}`}
                                            className="font-medium hover:text-purple-400 transition-colors"
                                        >
                                            {item.productName}
                                        </Link>
                                        {item.variantName && (
                                            <p className="text-sm text-gray-400">{item.variantName}</p>
                                        )}
                                        <p className="text-sm text-gray-400 mt-1">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{formatPrice(Number(item.price) * item.quantity)}</p>
                                        <p className="text-sm text-gray-400">{formatPrice(Number(item.price))} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                    {/* Totals */}
                    <div className="glass rounded-2xl p-6">
                        <h3 className="font-semibold mb-4">Order Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Subtotal</span>
                                <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between text-green-400">
                                    <span>Discount {order.promoCode && `(${order.promoCode.code})`}</span>
                                    <span>-{formatPrice(order.discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-400">Shipping</span>
                                <span>{order.shippingCost === 0 ? "FREE" : formatPrice(order.shippingCost)}</span>
                            </div>
                            {order.taxAmount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Tax</span>
                                    <span>{formatPrice(order.taxAmount)}</span>
                                </div>
                            )}
                            <div className="border-t border-white/10 pt-3">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span className="gradient-text">{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {shippingInfo?.address && (
                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Truck className="w-4 h-4 text-purple-400" />
                                <h3 className="font-semibold">Shipping Address</h3>
                            </div>
                            <div className="text-sm text-gray-300">
                                <p>{shippingInfo.name}</p>
                                <p>{shippingInfo.address.line1}</p>
                                {shippingInfo.address.line2 && <p>{shippingInfo.address.line2}</p>}
                                <p>
                                    {shippingInfo.address.city}, {shippingInfo.address.state} {shippingInfo.address.postal_code}
                                </p>
                                <p>{shippingInfo.address.country}</p>
                            </div>
                        </div>
                    )}

                    {/* Tracking */}
                    {order.trackingNumber && (
                        <div className="glass rounded-2xl p-6">
                            <h3 className="font-semibold mb-2">Tracking</h3>
                            <p className="text-purple-400 font-mono">{order.trackingNumber}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
