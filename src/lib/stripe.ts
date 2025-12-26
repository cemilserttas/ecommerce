import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
    typescript: true,
});

export async function createCheckoutSession({
    lineItems,
    customerEmail,
    metadata,
    successUrl,
    cancelUrl,
}: {
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
    customerEmail?: string;
    metadata?: Record<string, string>;
    successUrl: string;
    cancelUrl: string;
}) {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        customer_email: customerEmail,
        metadata,
        success_url: successUrl,
        cancel_url: cancelUrl,
        shipping_address_collection: {
            allowed_countries: ["US", "CA", "GB", "FR", "DE", "IT", "ES", "AU"],
        },
        billing_address_collection: "required",
    });

    return session;
}

export async function retrieveCheckoutSession(sessionId: string) {
    return stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items", "customer", "payment_intent"],
    });
}

export async function constructWebhookEvent(
    payload: string | Buffer,
    signature: string
) {
    return stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
    );
}
