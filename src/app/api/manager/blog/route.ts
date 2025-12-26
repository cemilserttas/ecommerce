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

        const posts = await prisma.blogPost.findMany({
            include: { author: { select: { firstName: true, lastName: true } } },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(posts);
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
        const {
            title,
            slug,
            content,
            excerpt,
            featuredImage,
            isPublished,
            metaTitle,
            metaDescription,
        } = body;

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug: slug || title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"),
                content,
                excerpt,
                featuredImage,
                isPublished: isPublished ?? false,
                publishedAt: isPublished ? new Date() : null,
                metaTitle,
                metaDescription,
                authorId: session.user.id,
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error("Error creating blog post:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
