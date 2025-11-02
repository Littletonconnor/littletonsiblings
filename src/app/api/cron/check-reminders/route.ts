import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { sendSMSToFamily } from "@/lib/twilio";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, display_name");

    if (usersError || !users) {
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    const overdueUsers = [];

    for (const user of users) {
      const { data: updates, error: updatesError } = await supabase
        .from("updates")
        .select("created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (updatesError) {
        continue;
      }

      const hasNoUpdates = !updates || updates.length === 0;
      const lastUpdate = updates?.[0];
      const isOverdue =
        hasNoUpdates ||
        new Date(lastUpdate.created_at) < oneWeekAgo;

      if (isOverdue) {
        overdueUsers.push(user.display_name);
      }
    }

    if (overdueUsers.length > 0) {
      const names = overdueUsers.join(", ");
      const message = `Hey fam! 👋 ${names} ${
        overdueUsers.length === 1 ? "hasn't" : "haven't"
      } checked in this week. Let's make sure everyone's doing okay!`;

      const results = await sendSMSToFamily(message);

      return NextResponse.json({
        success: true,
        overdueUsers,
        smsResults: results,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Everyone has checked in!",
      overdueUsers: [],
    });
  } catch (error) {
    console.error("Error in check-reminders cron:", error);
    return NextResponse.json(
      {
        error: "Failed to check reminders",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
