import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Plus, Edit, Trash2, Tag, Percent, DollarSign, Truck } from "lucide-react";

async function getPromoCodes() {
    try {
        return await prisma.promoCode.findMany({
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        return [];
    }
}

export default async function PromoCodesPage() {
    const promoCodes = await getPromoCodes();

    const getIcon = (type: string) => {
        switch (type) {
            case "PERCENTAGE":
                return <Percent className="w-4 h-4" />;
            case "FIXED_AMOUNT":
                return <DollarSign className="w-4 h-4" />;
            case "FREE_SHIPPING":
                return <Truck className="w-4 h-4" />;
            default:
                return <Tag className="w-4 h-4" />;
        }
    };

    const formatDiscount = (code: typeof promoCodes[0]) => {
        switch (code.discountType) {
            case "PERCENTAGE":
                return `${Number(code.discountValue)}%`;
            case "FIXED_AMOUNT":
                return formatPrice(Number(code.discountValue));
            case "FREE_SHIPPING":
                return "Free Shipping";
            default:
                return "-";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Promo Codes</h1>
                    <p className="text-gray-400 mt-1">{promoCodes.length} promo codes</p>
                </div>
                <Link
                    href="/manager/promo-codes/new"
                    className="btn-gradient flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Code
                </Link>
            </div>

            {/* Promo Codes Table */}
            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                            <th className="px-6 py-4 font-medium">Code</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium">Value</th>
                            <th className="px-6 py-4 font-medium">Usage</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Expires</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promoCodes.map((code) => {
                            const isExpired = code.expiresAt && new Date() > code.expiresAt;
                            const isActive = code.isActive && !isExpired;

                            return (
                                <tr
                                    key={code.id}
                                    className="border-b border-white/5 hover:bg-white/5"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg font-mono font-medium">
                                                {code.code}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            {getIcon(code.discountType)}
                                            <span className="text-sm">{code.discountType.replace("_", " ")}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        {formatDiscount(code)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">
                                        {code.usageCount}
                                        {code.usageLimit && ` / ${code.usageLimit}`}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${isActive
                                                    ? "bg-green-500/20 text-green-400"
                                                    : isExpired
                                                        ? "bg-red-500/20 text-red-400"
                                                        : "bg-gray-500/20 text-gray-400"
                                                }`}
                                        >
                                            {isExpired ? "Expired" : isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {code.expiresAt ? formatDate(code.expiresAt) : "Never"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/manager/promo-codes/${code.id}`}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {promoCodes.length === 0 && (
                    <div className="text-center py-12">
                        <Tag className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 mb-4">No promo codes yet</p>
                        <Link href="/manager/promo-codes/new" className="btn-gradient">
                            Create Your First Code
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
