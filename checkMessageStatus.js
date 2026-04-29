import "dotenv/config";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const messageSid = "MM0f7d58e9348ed67b71ea7750fcb4f9ac";

if (!accountSid || !authToken) {
    console.error("Error: Missing Twilio credentials");
    process.exit(1);
}

const client = twilio(accountSid, authToken);

async function checkStatus() {
    try {
        const message = await client.messages(messageSid).fetch();
        console.log("--- Message Status Check ---");
        console.log("SID:", message.sid);
        console.log("Status:", message.status);
        console.log("Error Code:", message.errorCode);
        console.log("Error Message:", message.errorMessage);
        console.log("To:", message.to);
        console.log("Date Created:", message.dateCreated);
        
        if (message.errorCode) {
            console.log("\nPossible Fixes:");
            if (message.errorCode === 63003) console.log("- User has not opted in (needed for some countries/templates)");
            if (message.errorCode === 63016) console.log("- Template mismatch or invalid variables");
        }
    } catch (err) {
        console.error("Failed to fetch message status:", err.message);
    }
}

checkStatus();
