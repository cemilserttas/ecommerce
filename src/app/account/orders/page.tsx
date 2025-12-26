import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, Eye, ChevronRight } from "lucide-react";

async function getOrders(userId: string) {
    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: { select: { slug: true } },
                    },
                    take: 3,
                },
                _count: { select: { items: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return orders.map((o) => ({
            ...o,
            total: Number(o.total),
        }));
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
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
        <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] || colors.PENDING}`}>
            {status}
        </span>
    );
}

export default async function OrdersPage() {
    const session = await getServerSession(authOptions);
    const orders = await getOrders(session!.user.id);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">My Orders</h1>
                <p className="text-gray-400 mt-1">Track and manage your orders</p>
            </div>

            {orders.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                    <Package className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                    <p className="text-gray-400 mb-4">
                        When you place an order, it will appear here.
                    </p>
                    <Link href="/products" className="btn-gradient inline-block">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="glass rounded-2xl p-6">
                            {/* Order Header */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold">{order.orderNumber}</span>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Placed on {formatDate(order.createdAt)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold gradient-text">{formatPrice(order.total)}</p>
                                    <p className="text-sm text-gray-400">{order._count.items} items</p>
                                </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4 overflow-x-auto">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="relative w-16 h-16 rounded-lg bg-gray-800 flex-shrink-0 overflow-hidden"
                                    >
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
                                        {item.quantity > 1 && (
                                            <span className="absolute bottom-0 right-0 text-xs bg-black/70 px-1 rounded">
                                                ×{item.quantity}
                                            </span>
                                        )}
                                    </div>
                                ))}
                                {order._count.items > 3 && (
                                    <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm text-gray-400">+{order._count.items - 3}</span>
                                    </div>
                                )}
                            </div>

                            {/* Order Actions */}
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-400">
                                    {order.status === "SHIPPED" && order.trackingNumber && (
                                        <span>Tracking: {order.trackingNumber}</span>
                                    )}
                                    {order.status === "DELIVERED" && order.deliveredAt && (
                                        <span>Delivered on {formatDate(order.deliveredAt)}</span>
                                    )}
                                </div>
                                <Link
                                    href={`/account/orders/${order.id}`}
                                    className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                                >
                                    View Details
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
