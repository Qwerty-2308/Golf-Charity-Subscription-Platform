import { Resend } from "resend";
import { env } from "@/lib/env";

let resend: Resend | null = null;

function getResend() {
  if (!env.resendApiKey) {
    return null;
  }

  if (!resend) {
    resend = new Resend(env.resendApiKey);
  }

  return resend;
}

export async function sendTransactionalEmail(args: {
  to: string;
  subject: string;
  html: string;
}) {
  const client = getResend();

  if (!client) {
    return { delivered: false, mode: "demo" as const };
  }

  await client.emails.send({
    from: "Good Drive Club <hello@gooddrive.club>",
    to: args.to,
    subject: args.subject,
    html: args.html,
  });

  return { delivered: true, mode: "live" as const };
}
