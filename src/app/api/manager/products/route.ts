import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - List all products
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || undefined;
        const categoryId = searchParams.get("category") || undefined;

        const where: any = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
            ];
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                category: true,
                images: { take: 1 },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST - Create new product
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["MANAGER", "ADMIN"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            slug,
            description,
            shortDescription,
            price,
            compareAtPrice,
            sku,
            stockQuantity,
            categoryId,
            isActive,
            isNew,
            isFeatured,
            fabricInfo,
            careInstructions,
            sizeChart,
            measurements,
            metaTitle,
            metaDescription,
        } = body;

        // Validation
        if (!name || !price) {
            return NextResponse.json(
                { error: "Name and price are required" },
                { status: 400 }
            );
        }

        // Check for duplicate slug
        if (slug) {
            const existing = await prisma.product.findUnique({ where: { slug } });
            if (existing) {
                return NextResponse.json(
                    { error: "A product with this slug already exists" },
                    { status: 400 }
                );
            }
        }

        const product = await prisma.product.create({
            data: {
                name,
                slug: slug || name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"),
                description,
                shortDescription,
                price,
                compareAtPrice: compareAtPrice || null,
                sku,
                stockQuantity: stockQuantity || 0,
                categoryId: categoryId || null,
                isActive: isActive ?? true,
                isNew: isNew ?? false,
                isFeatured: isFeatured ?? false,
                fabricInfo,
                careInstructions,
                sizeChart,
                measurements,
                metaTitle,
                metaDescription,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
