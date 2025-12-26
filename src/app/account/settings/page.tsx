"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Lock, Bell, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        promotions: true,
        newArrivals: false,
    });

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsChangingPassword(true);
        try {
            const response = await fetch("/api/account/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update password");
            }

            toast.success("Password updated successfully!");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update password");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await fetch("/api/account", { method: "DELETE" });
            if (!response.ok) {
                throw new Error("Failed to delete account");
            }
            signOut({ callbackUrl: "/" });
        } catch (error) {
            toast.error("Failed to delete account");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-gray-400 mt-1">Manage your account settings</p>
            </div>

            {/* Change Password */}
            <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                        <Lock className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="font-semibold">Change Password</h3>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                            className="input-base"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                            className="input-base"
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                            className="input-base"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="btn-gradient flex items-center gap-2"
                    >
                        {isChangingPassword ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update Password"
                        )}
                    </button>
                </form>
            </div>

            {/* Notification Preferences */}
            <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                        <Bell className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="font-semibold">Notification Preferences</h3>
                </div>

                <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                            <p className="font-medium">Order Updates</p>
                            <p className="text-sm text-gray-400">Get notified about your order status</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications.orderUpdates}
                            onChange={(e) => setNotifications((prev) => ({ ...prev, orderUpdates: e.target.checked }))}
                            className="w-5 h-5 rounded border-gray-600 bg-white/5 text-purple-500"
                        />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                            <p className="font-medium">Promotions</p>
                            <p className="text-sm text-gray-400">Receive exclusive deals and offers</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications.promotions}
                            onChange={(e) => setNotifications((prev) => ({ ...prev, promotions: e.target.checked }))}
                            className="w-5 h-5 rounded border-gray-600 bg-white/5 text-purple-500"
                        />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                            <p className="font-medium">New Arrivals</p>
                            <p className="text-sm text-gray-400">Be the first to know about new products</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications.newArrivals}
                            onChange={(e) => setNotifications((prev) => ({ ...prev, newArrivals: e.target.checked }))}
                            className="w-5 h-5 rounded border-gray-600 bg-white/5 text-purple-500"
                        />
                    </label>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="glass rounded-2xl p-6 border border-red-500/20">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-red-500/20">
                        <Trash2 className="w-5 h-5 text-red-400" />
                    </div>
                    <h3 className="font-semibold text-red-400">Danger Zone</h3>
                </div>

                <p className="text-gray-400 text-sm mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>

                <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
}
