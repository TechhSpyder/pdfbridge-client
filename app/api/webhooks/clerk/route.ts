import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { resend } from "@/utils/resend";
import WelcomeEmail from "@/modules/emails/welcome-email";

export async function POST(req: Request) {
  const payload = await req.text();

  const headers = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let event: WebhookEvent;

  try {
    event = wh.verify(payload, headers) as WebhookEvent;
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "user.created") {
    const user = event.data;

    const email = user.email_addresses?.[0]?.email_address;
    const firstName = user.first_name ?? undefined;

    if (email) {
      await resend.emails.send({
        from: "PDFBridge <accounts@pdfbridge.xyz>",
        to: email,
        subject: "Welcome to PDFBridge",
        react: WelcomeEmail({ firstName }),
      });
    }
  }

  return new Response("ok");
}
