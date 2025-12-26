import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    ArrowUpRight,
    Clock,
    AlertTriangle,
} from "lucide-react";

async function getDashboardStats() {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Current month orders
        const currentMonthOrders = await prisma.order.findMany({
            where: { createdAt: { gte: startOfMonth } },
            select: { total: true, status: true },
        });

        // Last month orders for comparison
        const lastMonthOrders = await prisma.order.findMany({
            where: {
                createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
            },
            select: { total: true },
        });

        const currentRevenue = currentMonthOrders.reduce(
            (sum, o) => sum + Number(o.total),
            0
        );
        const lastRevenue = lastMonthOrders.reduce(
            (sum, o) => sum + Number(o.total),
            0
        );
        const revenueChange = lastRevenue > 0
            ? ((currentRevenue - lastRevenue) / lastRevenue) * 100
            : 100;

        // Total customers
        const totalCustomers = await prisma.user.count({
            where: { role: "CLIENT" },
        });

        // New customers this month
        const newCustomers = await prisma.user.count({
            where: { role: "CLIENT", createdAt: { gte: startOfMonth } },
        });

        // Total products
        const totalProducts = await prisma.product.count({
            where: { isActive: true },
        });

        // Low stock products
        const lowStockProducts = await prisma.product.count({
            where: {
                isActive: true,
                trackInventory: true,
                stockQuantity: { lte: 5 },
            },
        });

        // Pending orders
        const pendingOrders = await prisma.order.count({
            where: { status: "PENDING" },
        });

        // Recent orders
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
            },
        });

        return {
            revenue: {
                current: currentRevenue,
                change: revenueChange,
            },
            orders: {
                total: currentMonthOrders.length,
                pending: pendingOrders,
            },
            customers: {
                total: totalCustomers,
                new: newCustomers,
            },
            products: {
                total: totalProducts,
                lowStock: lowStockProducts,
            },
            recentOrders: recentOrders.map((o) => ({
                id: o.id,
                orderNumber: o.orderNumber,
                customer: o.user.firstName
                    ? `${o.user.firstName} ${o.user.lastName}`
                    : o.user.email,
                total: Number(o.total),
                status: o.status,
                createdAt: o.createdAt,
            })),
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            revenue: { current: 0, change: 0 },
            orders: { total: 0, pending: 0 },
            customers: { total: 0, new: 0 },
            products: { total: 0, lowStock: 0 },
            recentOrders: [],
        };
    }
}

export default async function ManagerDashboard() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-gray-400 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Revenue */}
                <div className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-green-500/20">
                            <DollarSign className="w-5 h-5 text-green-400" />
                        </div>
                        <span
                            className={`flex items-center text-sm ${stats.revenue.change >= 0 ? "text-green-400" : "text-red-400"
                                }`}
                        >
                            {stats.revenue.change >= 0 ? (
                                <TrendingUp className="w-4 h-4 mr-1" />
                            ) : (
                                <TrendingDown className="w-4 h-4 mr-1" />
                            )}
                            {Math.abs(stats.revenue.change).toFixed(1)}%
                        </span>
                    </div>
                    <p className="text-2xl font-bold">{formatPrice(stats.revenue.current)}</p>
                    <p className="text-sm text-gray-400 mt-1">Revenue this month</p>
                </div>

                {/* Orders */}
                <div className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-purple-500/20">
                            <ShoppingCart className="w-5 h-5 text-purple-400" />
                        </div>
                        {stats.orders.pending > 0 && (
                            <span className="flex items-center text-sm text-yellow-400">
                                <Clock className="w-4 h-4 mr-1" />
                                {stats.orders.pending} pending
                            </span>
                        )}
                    </div>
                    <p className="text-2xl font-bold">{stats.orders.total}</p>
                    <p className="text-sm text-gray-400 mt-1">Orders this month</p>
                </div>

                {/* Customers */}
                <div className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-blue-500/20">
                            <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-sm text-green-400">+{stats.customers.new} new</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.customers.total}</p>
                    <p className="text-sm text-gray-400 mt-1">Total customers</p>
                </div>

                {/* Products */}
                <div className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-orange-500/20">
                            <Package className="w-5 h-5 text-orange-400" />
                        </div>
                        {stats.products.lowStock > 0 && (
                            <span className="flex items-center text-sm text-red-400">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                {stats.products.lowStock} low
                            </span>
                        )}
                    </div>
                    <p className="text-2xl font-bold">{stats.products.total}</p>
                    <p className="text-sm text-gray-400 mt-1">Active products</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-semibold">Recent Orders</h2>
                        <Link
                            href="/manager/orders"
                            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                            View All <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {stats.recentOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                                        <th className="pb-3 font-medium">Order</th>
                                        <th className="pb-3 font-medium">Customer</th>
                                        <th className="pb-3 font-medium">Total</th>
                                        <th className="pb-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="border-b border-white/5 hover:bg-white/5"
                                        >
                                            <td className="py-3">
                                                <Link
                                                    href={`/manager/orders/${order.id}`}
                                                    className="text-purple-400 hover:text-purple-300"
                                                >
                                                    {order.orderNumber}
                                                </Link>
                                            </td>
                                            <td className="py-3 text-gray-300">{order.customer}</td>
                                            <td className="py-3">{formatPrice(order.total)}</td>
                                            <td className="py-3">
                                                <StatusBadge status={order.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-8">No orders yet</p>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="font-semibold mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            href="/manager/products/new"
                            className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                        >
                            <Package className="w-5 h-5 text-purple-400" />
                            <span>Add New Product</span>
                        </Link>
                        <Link
                            href="/manager/orders?status=pending"
                            className="flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
                        >
                            <Clock className="w-5 h-5 text-yellow-400" />
                            <span>Process Pending Orders</span>
                        </Link>
                        <Link
                            href="/manager/promo-codes/new"
                            className="flex items-center gap-3 p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 transition-colors"
                        >
                            <DollarSign className="w-5 h-5 text-pink-400" />
                            <span>Create Promo Code</span>
                        </Link>
                        <Link
                            href="/manager/blog/new"
                            className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                        >
                            <Package className="w-5 h-5 text-blue-400" />
                            <span>Write Blog Post</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const statusColors: Record<string, string> = {
        PENDING: "bg-yellow-500/20 text-yellow-400",
        CONFIRMED: "bg-blue-500/20 text-blue-400",
        PROCESSING: "bg-purple-500/20 text-purple-400",
        SHIPPED: "bg-cyan-500/20 text-cyan-400",
        DELIVERED: "bg-green-500/20 text-green-400",
        CANCELLED: "bg-red-500/20 text-red-400",
        REFUNDED: "bg-gray-500/20 text-gray-400",
    };

    return (
        <span
            className={`inline-flex px-2 py-1 rounded text-xs font-medium ${statusColors[status] || "bg-gray-500/20 text-gray-400"
                }`}
        >
            {status}
        </span>
    );
}
