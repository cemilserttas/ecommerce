import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { XCircle, ArrowLeft, ShoppingBag } from "lucide-react";

export default function CheckoutCancelPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-32 pb-20">
                <div className="container-custom max-w-lg text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-6">
                        <XCircle className="w-10 h-10 text-red-400" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Checkout Cancelled</h1>
                    <p className="text-gray-400 mb-8">
                        Your order was not completed. No payment has been charged.
                    </p>

                    <div className="glass rounded-2xl p-6 mb-8">
                        <p className="text-sm text-gray-300">
                            Don&apos;t worry, your items are still in your cart. You can complete your purchase whenever you&apos;re ready.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/cart"
                            className="btn-gradient inline-flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Return to Cart
                        </Link>
                        <Link
                            href="/products"
                            className="px-6 py-3 border border-white/20 rounded-xl inline-flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
