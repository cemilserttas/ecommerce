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

        const pages = await prisma.page.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(pages);
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
        const { title, slug, content, isPublished, metaTitle, metaDescription } = body;

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const finalSlug = slug || title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

        // Check for duplicate slug
        const existing = await prisma.page.findUnique({ where: { slug: finalSlug } });
        if (existing) {
            return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
        }

        const page = await prisma.page.create({
            data: {
                title,
                slug: finalSlug,
                content,
                isPublished: isPublished ?? false,
                metaTitle,
                metaDescription,
            },
        });

        return NextResponse.json(page, { status: 201 });
    } catch (error) {
        console.error("Error creating page:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
