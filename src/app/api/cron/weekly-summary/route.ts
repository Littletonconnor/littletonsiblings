import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { sendSMSToFamily, getScoreEmoji } from "@/lib/twilio";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, display_name");

    if (usersError || !users) {
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    const summaries = [];

    for (const user of users) {
      const { data: updates, error: updatesError } = await supabase
        .from("updates")
        .select("message, score, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (updatesError) {
        continue;
      }

      if (updates && updates.length > 0) {
        const update = updates[0];
        summaries.push({
          name: user.display_name,
          message: update.message,
          score: update.score,
          emoji: getScoreEmoji(update.score),
        });
      } else {
        summaries.push({
          name: user.display_name,
          message: "No update this week",
          score: 0,
          emoji: "❓",
        });
      }
    }

    if (summaries.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No users to summarize",
      });
    }

    const summaryLines = summaries.map(
      (s) => `${s.emoji} ${s.name}: ${s.message}`
    );

    const message = `Weekly Sibling Check-in 🌟\n\n${summaryLines.join("\n")}`;

    const results = await sendSMSToFamily(message);

    return NextResponse.json({
      success: true,
      summaries,
      smsResults: results,
    });
  } catch (error) {
    console.error("Error in weekly-summary cron:", error);
    return NextResponse.json(
      {
        error: "Failed to generate weekly summary",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
