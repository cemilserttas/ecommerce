import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
    id: string;
    productId: string;
    variantId?: string;
    name: string;
    variantName?: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
    color?: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    promoCode: string | null;
    discount: number;

    // Actions
    addItem: (item: Omit<CartItem, "id">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    setPromoCode: (code: string | null, discount: number) => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;

    // Computed
    getSubtotal: () => number;
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            promoCode: null,
            discount: 0,

            addItem: (item) => {
                const items = get().items;
                const existingItem = items.find(
                    (i) => i.productId === item.productId && i.variantId === item.variantId
                );

                if (existingItem) {
                    set({
                        items: items.map((i) =>
                            i.productId === item.productId && i.variantId === item.variantId
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        ),
                    });
                } else {
                    set({
                        items: [...items, { ...item, id: crypto.randomUUID() }],
                    });
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
            },

            updateQuantity: (id, quantity) => {
                if (quantity < 1) {
                    get().removeItem(id);
                    return;
                }
                set({
                    items: get().items.map((i) =>
                        i.id === id ? { ...i, quantity } : i
                    ),
                });
            },

            clearCart: () => {
                set({ items: [], promoCode: null, discount: 0 });
            },

            setPromoCode: (code, discount) => {
                set({ promoCode: code, discount });
            },

            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set({ isOpen: !get().isOpen }),

            getSubtotal: () => {
                return get().items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },

            getTotal: () => {
                const subtotal = get().getSubtotal();
                const discount = get().discount;
                return subtotal - discount;
            },

            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: "cart-storage",
        }
    )
);
