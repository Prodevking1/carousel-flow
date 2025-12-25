import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!signature || !stripeWebhookSecret) {
      throw new Error("Missing signature or webhook secret");
    }

    const body = await req.text();
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeKey) {
      throw new Error("Stripe key not configured");
    }

    const verifyResponse = await fetch(
      "https://api.stripe.com/v1/webhook_endpoints/verify",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${stripeKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: body,
          signature: signature,
        }),
      }
    );

    const event = JSON.parse(body);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.user_id || session.client_reference_id;
      const subscriptionType = session.metadata.subscription_type;
      const amountPaid = session.amount_total;
      const customerId = session.customer;
      const paymentIntentId = session.payment_intent;

      const { error: subError } = await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          status: "active",
          subscription_type: subscriptionType,
          amount_paid: amountPaid,
          stripe_customer_id: customerId,
          stripe_payment_intent_id: paymentIntentId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      if (subError) {
        console.error("Error updating subscription:", subError);
        throw subError;
      }

      console.log(`Subscription activated for user ${userId}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});