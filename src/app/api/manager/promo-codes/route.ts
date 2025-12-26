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

        const codes = await prisma.promoCode.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(codes);
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
            code,
            description,
            discountType,
            discountValue,
            minOrderAmount,
            maxDiscount,
            usageLimit,
            startsAt,
            expiresAt,
            isActive,
        } = body;

        if (!code) {
            return NextResponse.json({ error: "Code is required" }, { status: 400 });
        }

        // Check for duplicate
        const existing = await prisma.promoCode.findUnique({ where: { code: code.toUpperCase() } });
        if (existing) {
            return NextResponse.json({ error: "Code already exists" }, { status: 400 });
        }

        const promoCode = await prisma.promoCode.create({
            data: {
                code: code.toUpperCase(),
                description,
                discountType,
                discountValue,
                minOrderAmount,
                maxDiscount,
                usageLimit,
                startsAt,
                expiresAt,
                isActive: isActive ?? true,
            },
        });

        return NextResponse.json(promoCode, { status: 201 });
    } catch (error) {
        console.error("Error creating promo code:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
