"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function NewPromoCodePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        code: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: 0,
        minOrderAmount: "",
        maxDiscount: "",
        usageLimit: "",
        startsAt: "",
        expiresAt: "",
        isActive: true,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/manager/promo-codes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    code: formData.code.toUpperCase(),
                    discountValue: Number(formData.discountValue),
                    minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : null,
                    maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
                    usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
                    startsAt: formData.startsAt ? new Date(formData.startsAt) : null,
                    expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create promo code");
            }

            toast.success("Promo code created!");
            router.push("/manager/promo-codes");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create promo code");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/manager/promo-codes"
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">New Promo Code</h1>
                        <p className="text-gray-400 mt-1">Create a new discount code</p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-gradient flex items-center gap-2"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Create Code
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="glass rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Code Details</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Code *
                            </label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                className="input-base font-mono uppercase"
                                placeholder="SUMMER2024"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={2}
                                className="input-base"
                                placeholder="20% off summer collection"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Discount Type *
                            </label>
                            <select
                                name="discountType"
                                value={formData.discountType}
                                onChange={handleChange}
                                className="input-base"
                            >
                                <option value="PERCENTAGE">Percentage</option>
                                <option value="FIXED_AMOUNT">Fixed Amount</option>
                                <option value="FREE_SHIPPING">Free Shipping</option>
                            </select>
                        </div>

                        {formData.discountType !== "FREE_SHIPPING" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Discount Value *
                                </label>
                                <input
                                    type="number"
                                    name="discountValue"
                                    value={formData.discountValue}
                                    onChange={handleChange}
                                    className="input-base"
                                    placeholder={formData.discountType === "PERCENTAGE" ? "20" : "25.00"}
                                    step={formData.discountType === "PERCENTAGE" ? "1" : "0.01"}
                                    min="0"
                                    required
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Restrictions */}
                <div className="glass rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Restrictions</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Minimum Order Amount
                            </label>
                            <input
                                type="number"
                                name="minOrderAmount"
                                value={formData.minOrderAmount}
                                onChange={handleChange}
                                className="input-base"
                                placeholder="50.00"
                                step="0.01"
                                min="0"
                            />
                        </div>

                        {formData.discountType === "PERCENTAGE" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Maximum Discount
                                </label>
                                <input
                                    type="number"
                                    name="maxDiscount"
                                    value={formData.maxDiscount}
                                    onChange={handleChange}
                                    className="input-base"
                                    placeholder="100.00"
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Usage Limit
                            </label>
                            <input
                                type="number"
                                name="usageLimit"
                                value={formData.usageLimit}
                                onChange={handleChange}
                                className="input-base"
                                placeholder="100"
                                min="1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Leave empty for unlimited uses
                            </p>
                        </div>
                    </div>
                </div>

                {/* Timing */}
                <div className="glass rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Timing</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Start Date
                            </label>
                            <input
                                type="datetime-local"
                                name="startsAt"
                                value={formData.startsAt}
                                onChange={handleChange}
                                className="input-base"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Expiry Date
                            </label>
                            <input
                                type="datetime-local"
                                name="expiresAt"
                                value={formData.expiresAt}
                                onChange={handleChange}
                                className="input-base"
                            />
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="glass rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Status</h3>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-gray-600 bg-white/5 text-purple-500"
                        />
                        <span>Active</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                        Inactive codes cannot be used by customers
                    </p>
                </div>
            </div>
        </form>
    );
}
