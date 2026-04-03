import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook inválido" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 });
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.created") {
    const subscription = event.data.object;
    const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

    await prisma.subscription.updateMany({
      where: { stripeCustomerId: customerId },
      data: {
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0]?.price.id,
        status: subscription.status === "active" ? "ACTIVE" : subscription.status === "trialing" ? "TRIALING" : "PAST_DUE",
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { status: "CANCELED" }
    });
  }

  return NextResponse.json({ received: true });
}
