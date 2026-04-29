import "dotenv/config";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM;
const testPhone = "+919490997946";

console.log("--- Twilio WhatsApp Direct Message Test ---");

const client = twilio(accountSid, authToken);

async function test() {
    try {
        console.log("Sending direct message...");
        const message = await client.messages.create({
            from: `whatsapp:${fromNumber}`,
            to:   `whatsapp:${testPhone}`,
            body: "Your Sugar Times code is 123456"
        });

        console.log("Success! Message SID:", message.sid);
        console.log("Status:", message.status);
    } catch (err) {
        console.error("Failed to send direct message:");
        console.error("Status:", err.status);
        console.error("Message:", err.message);
        console.error("Code:", err.code);
    }
}

test();
