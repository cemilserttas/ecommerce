import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AccountSidebar } from "./AccountSidebar";

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/login?callbackUrl=/account");
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <CartDrawer />

            <main className="pt-32 pb-20">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <AccountSidebar user={session.user} />
                        <div className="flex-1">{children}</div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
