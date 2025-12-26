import { CategoryForm } from "../CategoryForm";
import prisma from "@/lib/prisma";

async function getCategories() {
    try {
        return await prisma.category.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        });
    } catch (error) {
        return [];
    }
}

export default async function NewCategoryPage() {
    const categories = await getCategories();
    return <CategoryForm categories={categories} />;
}
