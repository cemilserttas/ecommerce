import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;

            // Update order status
            if (session.metadata?.orderNumber) {
                const order = await prisma.order.findFirst({
                    where: { orderNumber: session.metadata.orderNumber },
                });

                if (order) {
                    // Get shipping address from session
                    const shippingDetails = session.shipping_details;
                    const billingDetails = session.customer_details;

                    await prisma.order.update({
                        where: { id: order.id },
                        data: {
                            status: "CONFIRMED",
                            paymentStatus: "PAID",
                            stripePaymentId: session.payment_intent as string,
                            shippingInfo: shippingDetails ? {
                                name: shippingDetails.name,
                                address: shippingDetails.address,
                            } : undefined,
                            billingInfo: billingDetails ? {
                                name: billingDetails.name,
                                email: billingDetails.email,
                                phone: billingDetails.phone,
                                address: billingDetails.address,
                            } : undefined,
                        },
                    });

                    // Update promo code usage
                    if (session.metadata.promoCodeId) {
                        await prisma.promoCode.update({
                            where: { id: session.metadata.promoCodeId },
                            data: { usageCount: { increment: 1 } },
                        });
                    }

                    // Create notification for user
                    await prisma.notification.create({
                        data: {
                            userId: order.userId,
                            type: "ORDER_UPDATE",
                            title: "Order Confirmed",
                            message: `Your order ${order.orderNumber} has been confirmed!`,
                            link: `/account/orders/${order.id}`,
                        },
                    });

                    // Decrease stock for each item
                    const orderItems = await prisma.orderItem.findMany({
                        where: { orderId: order.id },
                    });

                    for (const item of orderItems) {
                        if (item.variantId) {
                            await prisma.productVariant.update({
                                where: { id: item.variantId },
                                data: { stockQuantity: { decrement: item.quantity } },
                            });
                        } else {
                            await prisma.product.update({
                                where: { id: item.productId },
                                data: { stockQuantity: { decrement: item.quantity } },
                            });
                        }
                    }

                    // Clear user's cart
                    const cart = await prisma.cart.findUnique({
                        where: { userId: order.userId },
                    });

                    if (cart) {
                        await prisma.cartItem.deleteMany({
                            where: { cartId: cart.id },
                        });
                    }
                }
            }
            break;
        }

        case "checkout.session.expired": {
            const session = event.data.object as Stripe.Checkout.Session;

            if (session.metadata?.orderNumber) {
                await prisma.order.updateMany({
                    where: {
                        orderNumber: session.metadata.orderNumber,
                        paymentStatus: "PENDING",
                    },
                    data: {
                        status: "CANCELLED",
                        paymentStatus: "FAILED",
                    },
                });
            }
            break;
        }

        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;

            await prisma.order.updateMany({
                where: { stripePaymentId: paymentIntent.id },
                data: { paymentStatus: "FAILED" },
            });
            break;
        }
    }

    return NextResponse.json({ received: true });
}
