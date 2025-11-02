import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase, supabaseAdmin } from "@/lib/db";
import { compare, hash } from "bcryptjs";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("password_hash")
      .eq("id", session.user.id)
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const isValidPassword = await compare(currentPassword, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const newPasswordHash = await hash(newPassword, 10);

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ password_hash: newPasswordHash })
      .eq("id", session.user.id);

    if (updateError) {
      console.error("Password update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update password", details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}
