import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const familyNumbers = process.env.FAMILY_GROUP_NUMBERS?.split(",") || [];

let twilioClient: ReturnType<typeof twilio> | null = null;

export function getTwilioClient() {
  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials not configured");
  }

  if (!twilioClient) {
    twilioClient = twilio(accountSid, authToken);
  }

  return twilioClient;
}

export async function sendSMSToFamily(message: string) {
  if (!twilioPhoneNumber) {
    throw new Error("Twilio phone number not configured");
  }

  if (familyNumbers.length === 0) {
    throw new Error("No family phone numbers configured");
  }

  const client = getTwilioClient();
  const results = [];

  for (const number of familyNumbers) {
    try {
      const result = await client.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: number.trim(),
      });
      results.push({ success: true, to: number, sid: result.sid });
    } catch (error) {
      results.push({
        success: false,
        to: number,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  return results;
}

export function getScoreEmoji(score: number): string {
  const emojiMap: Record<number, string> = {
    1: "😔",
    2: "😐",
    3: "🙂",
    4: "😄",
  };
  return emojiMap[score] || "❓";
}
