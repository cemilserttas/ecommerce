"use client";

import { useState } from "react";
import { MapPin, Plus, Edit, Trash2, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Address {
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
}

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        isDefault: false,
    });

    const resetForm = () => {
        setFormData({
            name: "",
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "United States",
            isDefault: false,
        });
        setIsAddingNew(false);
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // In a real app, this would save to the database
            const newAddress: Address = {
                id: editingId || Date.now().toString(),
                ...formData,
            };

            if (editingId) {
                setAddresses((prev) =>
                    prev.map((a) => (a.id === editingId ? newAddress : a))
                );
                toast.success("Address updated!");
            } else {
                setAddresses((prev) => [...prev, newAddress]);
                toast.success("Address added!");
            }
            resetForm();
        } catch (error) {
            toast.error("Failed to save address");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (address: Address) => {
        setFormData({
            name: address.name,
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country,
            isDefault: address.isDefault,
        });
        setEditingId(address.id);
        setIsAddingNew(true);
    };

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        toast.success("Address deleted");
    };

    const handleSetDefault = (id: string) => {
        setAddresses((prev) =>
            prev.map((a) => ({ ...a, isDefault: a.id === id }))
        );
        toast.success("Default address updated");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Addresses</h1>
                    <p className="text-gray-400 mt-1">Manage your shipping addresses</p>
                </div>
                {!isAddingNew && (
                    <button
                        onClick={() => setIsAddingNew(true)}
                        className="btn-gradient flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Address
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {isAddingNew && (
                <form onSubmit={handleSubmit} className="glass rounded-2xl p-6">
                    <h3 className="font-semibold mb-4">
                        {editingId ? "Edit Address" : "New Address"}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Address Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                className="input-base"
                                placeholder="Home, Work, etc."
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Street Address
                            </label>
                            <input
                                type="text"
                                value={formData.street}
                                onChange={(e) => setFormData((prev) => ({ ...prev, street: e.target.value }))}
                                className="input-base"
                                placeholder="123 Main St, Apt 4B"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                                className="input-base"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                State/Province
                            </label>
                            <input
                                type="text"
                                value={formData.state}
                                onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                                className="input-base"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                ZIP/Postal Code
                            </label>
                            <input
                                type="text"
                                value={formData.zipCode}
                                onChange={(e) => setFormData((prev) => ({ ...prev, zipCode: e.target.value }))}
                                className="input-base"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Country
                            </label>
                            <select
                                value={formData.country}
                                onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                                className="input-base"
                            >
                                <option>United States</option>
                                <option>Canada</option>
                                <option>United Kingdom</option>
                                <option>France</option>
                                <option>Germany</option>
                                <option>Australia</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isDefault}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))}
                                    className="w-4 h-4 rounded border-gray-600 bg-white/5 text-purple-500"
                                />
                                <span>Set as default address</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-gradient flex items-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {editingId ? "Update" : "Save"} Address
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Address List */}
            {addresses.length === 0 && !isAddingNew ? (
                <div className="glass rounded-2xl p-8 text-center">
                    <MapPin className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
                    <p className="text-gray-400 mb-4">
                        Add a shipping address to make checkout faster.
                    </p>
                    <button
                        onClick={() => setIsAddingNew(true)}
                        className="btn-gradient"
                    >
                        Add Your First Address
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className={`glass rounded-xl p-4 relative ${address.isDefault ? "border border-purple-500/50" : ""
                                }`}
                        >
                            {address.isDefault && (
                                <span className="absolute top-2 right-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                                    Default
                                </span>
                            )}

                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-white/5">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{address.name}</p>
                                    <p className="text-sm text-gray-400 mt-1">{address.street}</p>
                                    <p className="text-sm text-gray-400">
                                        {address.city}, {address.state} {address.zipCode}
                                    </p>
                                    <p className="text-sm text-gray-400">{address.country}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                                {!address.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(address.id)}
                                        className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Check className="w-4 h-4" />
                                        Set Default
                                    </button>
                                )}
                                <button
                                    onClick={() => handleEdit(address)}
                                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors ml-auto"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(address.id)}
                                    className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
