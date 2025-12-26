import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Search, Eye, Filter } from "lucide-react";

async function getOrders(params: {
    status?: string;
    search?: string;
}) {
    try {
        const where: any = {};

        if (params.status) {
            where.status = params.status;
        }

        if (params.search) {
            where.OR = [
                { orderNumber: { contains: params.search, mode: "insensitive" } },
                { user: { email: { contains: params.search, mode: "insensitive" } } },
            ];
        }

        const orders = await prisma.order.findMany({
            where,
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
                items: { include: { product: { select: { name: true } } } },
            },
            orderBy: { createdAt: "desc" },
            take: 50,
        });

        return orders.map((o) => ({
            ...o,
            total: Number(o.total),
            subtotal: Number(o.subtotal),
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

function PaymentBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        PENDING: "bg-yellow-500/20 text-yellow-400",
        PAID: "bg-green-500/20 text-green-400",
        FAILED: "bg-red-500/20 text-red-400",
        REFUNDED: "bg-gray-500/20 text-gray-400",
    };

    return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] || colors.PENDING}`}>
            {status}
        </span>
    );
}

export default async function OrdersPage() {
    const orders = await getOrders({});

    const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Orders</h1>
                <p className="text-gray-400 mt-1">{orders.length} total orders</p>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
                <Link
                    href="/manager/orders"
                    className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-medium"
                >
                    All ({orders.length})
                </Link>
                {Object.entries(statusCounts).map(([status, count]) => (
                    <Link
                        key={status}
                        href={`/manager/orders?status=${status}`}
                        className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 text-sm font-medium hover:bg-white/10"
                    >
                        {status} ({count})
                    </Link>
                ))}
            </div>

            {/* Search */}
            <div className="glass rounded-xl p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by order number or email..."
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                            <th className="px-6 py-4 font-medium">Order</th>
                            <th className="px-6 py-4 font-medium">Customer</th>
                            <th className="px-6 py-4 font-medium">Items</th>
                            <th className="px-6 py-4 font-medium">Total</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Payment</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="border-b border-white/5 hover:bg-white/5"
                            >
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/manager/orders/${order.id}`}
                                        className="text-purple-400 hover:text-purple-300 font-medium"
                                    >
                                        {order.orderNumber}
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-white">
                                            {order.user.firstName} {order.user.lastName}
                                        </p>
                                        <p className="text-sm text-gray-400">{order.user.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                                </td>
                                <td className="px-6 py-4 font-medium">
                                    {formatPrice(order.total)}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-6 py-4">
                                    <PaymentBadge status={order.paymentStatus} />
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm">
                                    {formatDate(order.createdAt)}
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/manager/orders/${order.id}`}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors inline-block"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {orders.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No orders found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
