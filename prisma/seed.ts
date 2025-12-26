import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { UserRole } from "@prisma/client";

async function seed() {
    console.log("🌱 Starting database seed...");

    // Create admin user
    const adminPassword = await hashPassword("admin123");
    const admin = await prisma.user.upsert({
        where: { email: "admin@luxe.com" },
        update: {},
        create: {
            email: "admin@luxe.com",
            password: adminPassword,
            firstName: "Admin",
            lastName: "User",
            role: UserRole.ADMIN,
        },
    });
    console.log("✅ Admin user created:", admin.email);

    // Create manager user
    const managerPassword = await hashPassword("manager123");
    const manager = await prisma.user.upsert({
        where: { email: "manager@luxe.com" },
        update: {},
        create: {
            email: "manager@luxe.com",
            password: managerPassword,
            firstName: "Manager",
            lastName: "User",
            role: UserRole.MANAGER,
        },
    });
    console.log("✅ Manager user created:", manager.email);

    // Create test client
    const clientPassword = await hashPassword("client123");
    const client = await prisma.user.upsert({
        where: { email: "client@test.com" },
        update: {},
        create: {
            email: "client@test.com",
            password: clientPassword,
            firstName: "John",
            lastName: "Doe",
            role: UserRole.CLIENT,
        },
    });
    console.log("✅ Test client created:", client.email);

    // Create cart and wishlist for client
    await prisma.cart.upsert({
        where: { userId: client.id },
        update: {},
        create: { userId: client.id },
    });
    await prisma.wishlist.upsert({
        where: { userId: client.id },
        update: {},
        create: { userId: client.id },
    });

    // Create categories
    const categories = [
        { name: "Women", slug: "women", description: "Women's fashion and apparel" },
        { name: "Men", slug: "men", description: "Men's fashion and apparel" },
        { name: "Accessories", slug: "accessories", description: "Fashion accessories" },
        { name: "Shoes", slug: "shoes", description: "Footwear for all occasions" },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
    }
    console.log("✅ Categories created");

    // Get women category for products
    const womenCat = await prisma.category.findUnique({ where: { slug: "women" } });
    const menCat = await prisma.category.findUnique({ where: { slug: "men" } });

    // Create sample products
    const products = [
        {
            name: "Premium Wool Overcoat",
            slug: "premium-wool-overcoat",
            description: "Luxurious wool overcoat crafted from the finest Italian wool. Features a classic silhouette with modern detailing.",
            shortDescription: "Elegant Italian wool overcoat for sophisticated style.",
            price: 299.99,
            compareAtPrice: 399.99,
            stockQuantity: 50,
            categoryId: womenCat?.id,
            isActive: true,
            isNew: true,
            fabricInfo: "80% Italian Wool, 20% Cashmere",
            careInstructions: "Dry clean only. Store on padded hanger.",
        },
        {
            name: "Cashmere Sweater",
            slug: "cashmere-sweater",
            description: "Ultra-soft cashmere sweater in a relaxed fit. Perfect for layering or wearing alone.",
            shortDescription: "Soft and luxurious cashmere for everyday elegance.",
            price: 189.99,
            stockQuantity: 75,
            categoryId: womenCat?.id,
            isActive: true,
            isFeatured: true,
            fabricInfo: "100% Mongolian Cashmere",
            careInstructions: "Hand wash cold, lay flat to dry.",
        },
        {
            name: "Slim Fit Chinos",
            slug: "slim-fit-chinos",
            description: "Classic slim fit chinos in premium stretch cotton. Versatile style from office to weekend.",
            shortDescription: "Modern slim fit with comfortable stretch.",
            price: 89.99,
            compareAtPrice: 120.00,
            stockQuantity: 100,
            categoryId: menCat?.id,
            isActive: true,
            fabricInfo: "98% Cotton, 2% Elastane",
            careInstructions: "Machine wash cold, tumble dry low.",
        },
        {
            name: "Leather Crossbody Bag",
            slug: "leather-crossbody-bag",
            description: "Handcrafted leather crossbody bag with adjustable strap. Multiple compartments for organization.",
            shortDescription: "Artisan leather bag for everyday use.",
            price: 159.99,
            stockQuantity: 30,
            categoryId: womenCat?.id,
            isActive: true,
            isNew: true,
            fabricInfo: "Full grain Italian leather",
            careInstructions: "Wipe with damp cloth, use leather conditioner.",
        },
    ];

    for (const prod of products) {
        await prisma.product.upsert({
            where: { slug: prod.slug },
            update: {},
            create: prod,
        });
    }
    console.log("✅ Sample products created");

    // Create promo codes
    await prisma.promoCode.upsert({
        where: { code: "WELCOME15" },
        update: {},
        create: {
            code: "WELCOME15",
            description: "15% off for new customers",
            discountType: "PERCENTAGE",
            discountValue: 15,
            isActive: true,
        },
    });
    await prisma.promoCode.upsert({
        where: { code: "FREESHIP" },
        update: {},
        create: {
            code: "FREESHIP",
            description: "Free shipping on orders over $50",
            discountType: "FREE_SHIPPING",
            discountValue: 0,
            minOrderAmount: 50,
            isActive: true,
        },
    });
    console.log("✅ Promo codes created");

    // Create a sample static page
    await prisma.staticPage.upsert({
        where: { slug: "faq" },
        update: {},
        create: {
            title: "Frequently Asked Questions",
            slug: "faq",
            content: `
        <h2>Shipping</h2>
        <p><strong>Q: How long does shipping take?</strong></p>
        <p>A: Standard shipping takes 5-7 business days. Express shipping is 2-3 business days.</p>
        
        <h2>Returns</h2>
        <p><strong>Q: What is your return policy?</strong></p>
        <p>A: We offer free returns within 30 days of purchase for unworn items with tags attached.</p>
      `,
            isPublished: true,
            metaTitle: "FAQ | LUXE",
            metaDescription: "Find answers to frequently asked questions about shipping, returns, and more.",
        },
    });
    await prisma.staticPage.upsert({
        where: { slug: "terms" },
        update: {},
        create: {
            title: "Terms of Service",
            slug: "terms",
            content: "<p>Terms of service content goes here...</p>",
            isPublished: true,
        },
    });
    console.log("✅ Static pages created");

    console.log("\n🎉 Database seed completed successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("   Admin: admin@luxe.com / admin123");
    console.log("   Manager: manager@luxe.com / manager123");
    console.log("   Client: client@test.com / client123");
}

seed()
    .catch((e) => {
        console.error("Error seeding database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
