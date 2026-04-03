import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL));

  const userId = session.user.id;

  const sub = await prisma.subscription.findFirst({ where: { userId } });

  const customer = sub?.stripeCustomerId
    ? { id: sub.stripeCustomerId }
    : await stripe.customers.create({ email: session.user.email, metadata: { userId } });

  if (!sub) {
    await prisma.subscription.create({
      data: {
        userId,
        stripeCustomerId: customer.id,
        status: "FREE"
      }
    });
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customer.id,
    line_items: [{ price: process.env.STRIPE_PRICE_ID_PREMIUM, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`
  });

  return NextResponse.redirect(checkout.url ?? `${process.env.NEXT_PUBLIC_APP_URL}/pricing`);
}
