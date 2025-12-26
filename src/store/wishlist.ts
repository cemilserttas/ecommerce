import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    image: string;
    slug: string;
}

interface WishlistState {
    items: WishlistItem[];

    // Actions
    addItem: (item: Omit<WishlistItem, "id">) => void;
    removeItem: (productId: string) => void;
    clearWishlist: () => void;
    isInWishlist: (productId: string) => boolean;
    toggleItem: (item: Omit<WishlistItem, "id">) => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const items = get().items;
                const exists = items.some((i) => i.productId === item.productId);

                if (!exists) {
                    set({
                        items: [...items, { ...item, id: crypto.randomUUID() }],
                    });
                }
            },

            removeItem: (productId) => {
                set({
                    items: get().items.filter((i) => i.productId !== productId),
                });
            },

            clearWishlist: () => {
                set({ items: [] });
            },

            isInWishlist: (productId) => {
                return get().items.some((i) => i.productId === productId);
            },

            toggleItem: (item) => {
                const isInWishlist = get().isInWishlist(item.productId);
                if (isInWishlist) {
                    get().removeItem(item.productId);
                } else {
                    get().addItem(item);
                }
            },
        }),
        {
            name: "wishlist-storage",
        }
    )
);
