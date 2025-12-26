"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bell, Check, Trash2, Package, Tag, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    link: string | null;
    isRead: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch("/api/account/notifications");
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/account/notifications/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isRead: true }),
            });
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch("/api/account/notifications/mark-all-read", {
                method: "POST",
            });
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await fetch(`/api/account/notifications/${id}`, {
                method: "DELETE",
            });
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "ORDER_UPDATE":
                return <Package className="w-5 h-5" />;
            case "PROMO":
                return <Tag className="w-5 h-5" />;
            default:
                return <MessageSquare className="w-5 h-5" />;
        }
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    <p className="text-gray-400 mt-1">
                        {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 text-sm border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <Check className="w-4 h-4" />
                        Mark all as read
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="glass rounded-xl p-8 text-center">
                    <div className="animate-pulse">Loading...</div>
                </div>
            ) : notifications.length === 0 ? (
                <div className="glass rounded-xl p-8 text-center">
                    <Bell className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                    <p className="text-gray-400">
                        We&apos;ll notify you when something important happens.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`glass rounded-xl p-4 flex items-start gap-4 transition-colors ${!notification.isRead ? "border-l-2 border-purple-500" : ""
                                }`}
                        >
                            {/* Icon */}
                            <div
                                className={`p-2 rounded-lg ${notification.isRead ? "bg-white/5" : "bg-purple-500/20"
                                    }`}
                            >
                                <span className={notification.isRead ? "text-gray-400" : "text-purple-400"}>
                                    {getIcon(notification.type)}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className={`font-medium ${!notification.isRead ? "text-white" : "text-gray-300"}`}>
                                        {notification.title}
                                    </h4>
                                    {!notification.isRead && (
                                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                    {formatDate(new Date(notification.createdAt))}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                                {notification.link && (
                                    <Link
                                        href={notification.link}
                                        onClick={() => markAsRead(notification.id)}
                                        className="px-3 py-1.5 text-sm bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                                    >
                                        View
                                    </Link>
                                )}
                                {!notification.isRead && (
                                    <button
                                        onClick={() => markAsRead(notification.id)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        title="Mark as read"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteNotification(notification.id)}
                                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
