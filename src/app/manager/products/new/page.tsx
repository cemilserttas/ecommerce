import { ProductForm } from "../ProductForm";
import prisma from "@/lib/prisma";

async function getCategories() {
    try {
        return await prisma.category.findMany({
            where: { isActive: true },
            orderBy: { name: "asc" },
            select: { id: true, name: true },
        });
    } catch (error) {
        return [];
    }
}

export default async function NewProductPage() {
    const categories = await getCategories();

    return <ProductForm categories={categories} />;
}
