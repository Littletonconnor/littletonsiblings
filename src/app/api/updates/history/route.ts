import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: updates, error } = await supabase
      .from("updates")
      .select(`
        id,
        message,
        score,
        created_at,
        week_start_date,
        users (
          display_name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formattedUpdates = updates?.map((update: any) => ({
      id: update.id,
      displayName: update.users.display_name,
      message: update.message,
      score: update.score,
      createdAt: update.created_at,
      weekStartDate: update.week_start_date,
    }));

    return NextResponse.json(formattedUpdates || []);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
