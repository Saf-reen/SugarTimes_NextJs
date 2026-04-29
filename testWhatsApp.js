import "dotenv/config";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM;
const templateSid = "HXfe661910fd2fc55b60be656e5ee37cb5";
const testPhone = "+919490997946";

console.log("--- Twilio WhatsApp Test ---");
console.log("Account SID:", accountSid);
console.log("From:", fromNumber);
console.log("Template SID:", templateSid);
console.log("Recipient:", testPhone);

if (!accountSid || !authToken || !fromNumber || !templateSid) {
    console.error("Error: Missing Twilio credentials in .env");
    process.exit(1);
}

const client = twilio(accountSid, authToken);

async function test() {
    try {
        console.log("Sending message via Messaging Service...");
        const message = await client.messages.create({
            messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
            to:   `whatsapp:${testPhone}`,
            contentSid: templateSid,
        });

        console.log("Success! Message SID:", message.sid);
        console.log("Status:", message.status);
        console.log("Error Code:", message.errorCode);
        console.log("Error Message:", message.errorMessage);
        
        // Wait a bit to check status updates (Twilio status updates are usually via webhook, but let's check immediate response)
        console.log("\nFull Response Object:", JSON.stringify(message, null, 2));

    } catch (err) {
        console.error("Failed to send WhatsApp message:");
        console.error("Status:", err.status);
        console.error("Message:", err.message);
        console.error("Code:", err.code);
        console.error("More info:", err.moreInfo);
    }
}

test();
