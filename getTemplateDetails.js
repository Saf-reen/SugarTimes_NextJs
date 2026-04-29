import "dotenv/config";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const templateSid = "HXfe661910fd2fc55b60be656e5ee37cb5";

const client = twilio(accountSid, authToken);

async function getTemplate() {
    try {
        console.log("Fetching template details...");
        const content = await client.content.v1.contents(templateSid).fetch();
        console.log("--- Template Details ---");
        console.log("SID:", content.sid);
        console.log("Friendly Name:", content.friendlyName);
        console.log("Language(s):", JSON.stringify(content.types, null, 2));
    } catch (err) {
        console.error("Failed to fetch template:", err.message);
    }
}

getTemplate();
