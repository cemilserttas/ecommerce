import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Users, Eye, Mail, ShoppingBag } from "lucide-react";

async function getCustomers() {
    try {
        return await prisma.user.findMany({
            where: { role: "CLIENT" },
            include: {
                _count: { select: { orders: true } },
                orders: {
                    select: { total: true },
                },
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });
    } catch (error) {
        return [];
    }
}

export default async function CustomersPage() {
    const customers = await getCustomers();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Customers</h1>
                <p className="text-gray-400 mt-1">{customers.length} registered customers</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/20">
                            <Users className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{customers.length}</p>
                            <p className="text-sm text-gray-400">Total Customers</p>
                        </div>
                    </div>
                </div>
                <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/20">
                            <ShoppingBag className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {customers.filter((c) => c._count.orders > 0).length}
                            </p>
                            <p className="text-sm text-gray-400">With Orders</p>
                        </div>
                    </div>
                </div>
                <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20">
                            <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {customers.filter((c) => {
                                    const thirtyDaysAgo = new Date();
                                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                                    return new Date(c.createdAt) > thirtyDaysAgo;
                                }).length}
                            </p>
                            <p className="text-sm text-gray-400">New This Month</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customers Table */}
            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                            <th className="px-6 py-4 font-medium">Customer</th>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium">Orders</th>
                            <th className="px-6 py-4 font-medium">Total Spent</th>
                            <th className="px-6 py-4 font-medium">Joined</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => {
                            const totalSpent = customer.orders.reduce(
                                (sum, o) => sum + Number(o.total),
                                0
                            );

                            return (
                                <tr
                                    key={customer.id}
                                    className="border-b border-white/5 hover:bg-white/5"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-semibold">
                                                {customer.firstName?.[0] || customer.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {customer.firstName
                                                        ? `${customer.firstName} ${customer.lastName}`
                                                        : "No name"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{customer.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded bg-white/10 text-sm">
                                            {customer._count.orders}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        ${totalSpent.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {formatDate(customer.createdAt)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/manager/customers/${customer.id}`}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <a
                                                href={`mailto:${customer.email}`}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            >
                                                <Mail className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {customers.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400">No customers yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
