import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { items, promoCode } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items in cart" }, { status: 400 });
        }

        // Calculate totals
        let subtotal = 0;
        const lineItems = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
                include: { images: { take: 1 } },
            });

            if (!product) {
                return NextResponse.json(
                    { error: `Product not found: ${item.productId}` },
                    { status: 400 }
                );
            }

            const price = Number(product.price);
            subtotal += price * item.quantity;

            lineItems.push({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        description: item.variantName || undefined,
                        images: product.images[0] ? [product.images[0].url] : undefined,
                    },
                    unit_amount: Math.round(price * 100), // Stripe uses cents
                },
                quantity: item.quantity,
            });
        }

        // Apply promo code if provided
        let discount = 0;
        let promoCodeId = null;

        if (promoCode) {
            const code = await prisma.promoCode.findUnique({
                where: { code: promoCode },
            });

            if (code && code.isActive) {
                if (code.discountType === "PERCENTAGE") {
                    discount = subtotal * (Number(code.discountValue) / 100);
                    if (code.maxDiscount) {
                        discount = Math.min(discount, Number(code.maxDiscount));
                    }
                } else if (code.discountType === "FIXED_AMOUNT") {
                    discount = Number(code.discountValue);
                }
                promoCodeId = code.id;
            }
        }

        const total = subtotal - discount;
        const orderNumber = generateOrderNumber();

        // Create Stripe checkout session
        const origin = request.headers.get("origin") || "http://localhost:3000";

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            customer_email: session.user.email,
            metadata: {
                userId: session.user.id,
                orderNumber,
                promoCodeId: promoCodeId || "",
                discount: discount.toString(),
            },
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout/cancel`,
            shipping_address_collection: {
                allowed_countries: ["US", "CA", "GB", "FR", "DE", "IT", "ES", "AU"],
            },
            billing_address_collection: "required",
        });

        // Create pending order
        await prisma.order.create({
            data: {
                orderNumber,
                userId: session.user.id,
                subtotal,
                discountAmount: discount,
                total,
                status: "PENDING",
                paymentStatus: "PENDING",
                stripeSessionId: checkoutSession.id,
                promoCodeId,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        variantId: item.variantId || null,
                        quantity: item.quantity,
                        price: item.price,
                        productName: item.name,
                        variantName: item.variantName || null,
                        productImage: item.image || null,
                    })),
                },
            },
        });

        return NextResponse.json({
            sessionId: checkoutSession.id,
            url: checkoutSession.url,
        });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
