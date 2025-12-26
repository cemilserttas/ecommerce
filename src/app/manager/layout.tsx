import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ManagerSidebar } from "./ManagerSidebar";
import { ManagerHeader } from "./ManagerHeader";

export default async function ManagerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    // Redirect if not authenticated or not a manager/admin
    if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
        redirect("/manager/login");
    }

    return (
        <div className="min-h-screen bg-background flex">
            <ManagerSidebar />
            <div className="flex-1 flex flex-col ml-64">
                <ManagerHeader user={session.user} />
                <main className="flex-1 p-6 mt-16">
                    {children}
                </main>
            </div>
        </div>
    );
}
