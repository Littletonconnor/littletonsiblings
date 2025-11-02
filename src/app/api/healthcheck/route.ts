import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET() {
  try {
    const { data: updates, error } = await supabase
      .from("updates")
      .select(`
        message,
        score,
        created_at,
        users (
          display_name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const latestUpdates = new Map();

    updates?.forEach((update: any) => {
      const displayName = update.users.display_name;
      if (!latestUpdates.has(displayName)) {
        latestUpdates.set(displayName, {
          displayName,
          lastUpdatedAt: update.created_at,
          message: update.message,
          score: update.score,
        });
      }
    });

    return NextResponse.json(Array.from(latestUpdates.values()));
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch updates" },
      { status: 500 }
    );
  }
}
