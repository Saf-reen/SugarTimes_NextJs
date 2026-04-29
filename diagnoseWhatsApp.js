import "dotenv/config";
import twilio from "twilio";

const accountSid  = process.env.TWILIO_ACCOUNT_SID;
const authToken   = process.env.TWILIO_AUTH_TOKEN;
const msgServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const templateSid = process.env.TWILIO_OTP_TEMPLATE_SID || "HXfe661910fd2fc55b60be656e5ee37cb5";

if (!accountSid || !authToken) {
  console.error("Missing TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN in .env");
  process.exit(1);
}

const client = twilio(accountSid, authToken);

const ERR_HINTS = {
  63003: "Channel not found / sender not WhatsApp-enabled",
  63007: "Channel not found for the From address (sender not provisioned for WhatsApp)",
  63013: "Message body conflicts with WhatsApp policy",
  63015: "Recipient phone number is not a WhatsApp user",
  63016: "Free-form message outside the 24h session window — must use a template",
  63017: "Channel could not send the message (likely template not approved)",
  63018: "Daily messaging limit exceeded for this sender",
  63024: "Invalid messaging service",
  63032: "Sender not registered with WhatsApp / Embedded Sign-up not complete",
  63038: "Account exceeded daily messages (Twilio sandbox/free tier: 9/day)",
  63051: "Recipient has not opted in (sandbox: must send 'join <keyword>' first)",
  63054: "WABA suspended",
  21211: "Invalid 'To' phone number",
  21408: "Permission to send to that country is not enabled",
  21610: "Recipient unsubscribed (STOP'd)",
};

(async () => {
  console.log("=== Twilio WhatsApp Diagnostic ===\n");

  // 1. Validate Messaging Service & senders
  if (msgServiceSid) {
    try {
      const svc = await client.messaging.v1.services(msgServiceSid).fetch();
      console.log(`Messaging Service: ${svc.friendlyName}  (${svc.sid})`);
    } catch (e) {
      console.error(`Cannot fetch Messaging Service ${msgServiceSid}:`, e.message);
    }

    try {
      const senders = await client.messaging.v1.services(msgServiceSid).phoneNumbers.list({ limit: 20 });
      console.log(`Senders in pool: ${senders.length}`);
      senders.forEach(p => console.log(`  - ${p.phoneNumber}  capabilities=${JSON.stringify(p.capabilities)}`));
      if (senders.length === 0) {
        console.log("  WARNING: Messaging Service has NO phone numbers attached.");
      }
    } catch (e) {
      console.error("Cannot list senders:", e.message);
    }
  } else {
    console.log("TWILIO_MESSAGING_SERVICE_SID not set in .env");
  }

  // 2. Validate template
  console.log(`\nTemplate SID: ${templateSid}`);
  try {
    const content = await client.content.v1.contents(templateSid).fetch();
    console.log(`  Friendly name: ${content.friendlyName}`);
    console.log(`  Language: ${content.language}`);
    console.log(`  Variables: ${JSON.stringify(content.variables)}`);

    const approvals = await client.content.v1.contents(templateSid).approvalRequests().fetch();
    console.log(`  WhatsApp approval status: ${approvals.whatsapp?.status || "(unknown)"}`);
    if (approvals.whatsapp?.rejection_reason) {
      console.log(`  Rejection reason: ${approvals.whatsapp.rejection_reason}`);
    }
  } catch (e) {
    console.error(`  Cannot fetch template: ${e.message}`);
  }

  // 3. Last 10 messages — see what really happened
  console.log("\n=== Last 10 messages on this account ===");
  const messages = await client.messages.list({ limit: 10 });
  messages.forEach(m => {
    const hint = m.errorCode ? `  [HINT: ${ERR_HINTS[m.errorCode] || "see twilio.com/docs/api/errors/" + m.errorCode}]` : "";
    console.log(
      `${m.dateCreated.toISOString()}  ${m.sid}  ${m.status.padEnd(11)}  ${m.from || "(svc)"} -> ${m.to}` +
      (m.errorCode ? `  errorCode=${m.errorCode}  errorMessage=${m.errorMessage}${hint}` : "")
    );
  });
})().catch(e => {
  console.error("Diagnostic failed:", e);
  process.exit(1);
});
