import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const categories = await prisma.category.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: { sortOrder: "asc" },
        });

        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, slug, description, image, parentId, isActive, metaTitle, metaDescription } = body;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        // Check for duplicate slug
        const finalSlug = slug || name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
        const existing = await prisma.category.findUnique({ where: { slug: finalSlug } });
        if (existing) {
            return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug: finalSlug,
                description,
                image,
                parentId: parentId || null,
                isActive: isActive ?? true,
                metaTitle,
                metaDescription,
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
