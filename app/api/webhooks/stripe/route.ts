import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Configuração inválida" },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Assinatura não encontrada" },
      { status: 400 },
    );
  }

  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-10-28.acacia",
  });

  try {
    const event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const { customer, subscription, metadata } = event.data.object;

        const clerkUserId = metadata?.clerk_user_id;

        if (!clerkUserId) {
          return NextResponse.json({ received: true });
        }

        const clerk = await clerkClient();

        await clerk.users.updateUser(clerkUserId, {
          privateMetadata: {
            stripeCustomerId:
              typeof customer === "string" ? customer : customer?.id,
            stripeSubscriptionId:
              typeof subscription === "string"
                ? subscription
                : subscription?.id,
          },
          publicMetadata: {
            subscriptionPlan: "pro",
          },
        });

        break;
      }
      case "customer.subscription.deleted": {
        // Remover o plano do user
        const subscription = await stripe.subscriptions.retrieve(
          event.data.object.id,
        );
        const clerkUserId = subscription.metadata.clerk_user_id;
        if (!clerkUserId) {
          return NextResponse.error();
        }
        await clerkClient().users.updateUser(clerkUserId, {
          privateMetadata: {
            stripeCustomerId: null,
            stripeSubscriptionId: null,
          },
          publicMetadata: {
            subscriptionPlan: null,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 400 },
    );
  }
};
