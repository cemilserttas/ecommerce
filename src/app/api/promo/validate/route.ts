import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, subtotal } = body;

        if (!code) {
            return NextResponse.json({ error: "Promo code is required" }, { status: 400 });
        }

        const promoCode = await prisma.promoCode.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (!promoCode) {
            return NextResponse.json({ error: "Invalid promo code" }, { status: 400 });
        }

        if (!promoCode.isActive) {
            return NextResponse.json({ error: "This promo code is no longer active" }, { status: 400 });
        }

        // Check expiration
        if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
            return NextResponse.json({ error: "This promo code has expired" }, { status: 400 });
        }

        // Check start date
        if (promoCode.startsAt && new Date() < promoCode.startsAt) {
            return NextResponse.json({ error: "This promo code is not yet valid" }, { status: 400 });
        }

        // Check usage limit
        if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
            return NextResponse.json({ error: "This promo code has reached its usage limit" }, { status: 400 });
        }

        // Check minimum order amount
        if (promoCode.minOrderAmount && subtotal < Number(promoCode.minOrderAmount)) {
            return NextResponse.json(
                { error: `Minimum order amount is $${Number(promoCode.minOrderAmount).toFixed(2)}` },
                { status: 400 }
            );
        }

        // Calculate discount
        let discount = 0;

        switch (promoCode.discountType) {
            case "PERCENTAGE":
                discount = subtotal * (Number(promoCode.discountValue) / 100);
                if (promoCode.maxDiscount) {
                    discount = Math.min(discount, Number(promoCode.maxDiscount));
                }
                break;
            case "FIXED_AMOUNT":
                discount = Math.min(Number(promoCode.discountValue), subtotal);
                break;
            case "FREE_SHIPPING":
                discount = 9.99; // Shipping cost
                break;
        }

        return NextResponse.json({
            valid: true,
            code: promoCode.code,
            discountType: promoCode.discountType,
            discount: Math.round(discount * 100) / 100,
            description: promoCode.description,
        });
    } catch (error) {
        console.error("Promo validation error:", error);
        return NextResponse.json({ error: "Failed to validate promo code" }, { status: 500 });
    }
}
