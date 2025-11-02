import { hash } from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import * as readline from "readline";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables!");
  console.error("Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

const users = [
  {
    username: "connor",
    password: "password123",
    display_name: "Connor",
  },
  {
    username: "justin",
    password: "password123",
    display_name: "Justin",
  },
  {
    username: "kyle",
    password: "password123",
    display_name: "Kyle",
  },
  {
    username: "josh",
    password: "password123",
    display_name: "Josh",
  },
  {
    username: "zoe",
    password: "password123",
    display_name: "Zoe",
  },
];

async function seed() {
  console.log("🌱 Database Seed Script\n");
  console.log("📍 Target Database:", supabaseUrl);

  const { data: existingUsers, error: fetchError } = await supabase
    .from("users")
    .select("username, display_name");

  if (fetchError) {
    console.error("❌ Failed to fetch existing users:", fetchError.message);
    process.exit(1);
  }

  console.log("\n📊 Current users in database:", existingUsers?.length || 0);
  if (existingUsers && existingUsers.length > 0) {
    existingUsers.forEach((u) => {
      console.log(`   - ${u.display_name} (@${u.username})`);
    });
  }

  console.log("\n➕ Users to be added:", users.length);
  users.forEach((u) => {
    const exists = existingUsers?.some((eu) => eu.username === u.username);
    const status = exists ? "⚠️  EXISTS (will skip)" : "✅ NEW";
    console.log(`   ${status} ${u.display_name} (@${u.username})`);
  });

  console.log("\n⚠️  IMPORTANT:");
  console.log("   - Existing users will NOT be modified");
  console.log("   - Only NEW users will be added");
  console.log("   - Passwords cannot be changed via this script");

  const answer = await askQuestion("\n❓ Continue with seed? (yes/no): ");

  if (answer.toLowerCase() !== "yes" && answer.toLowerCase() !== "y") {
    console.log("\n🚫 Seed cancelled. No changes made.");
    process.exit(0);
  }

  console.log("\n🌱 Starting database seed...");

  let addedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const user of users) {
    const passwordHash = await hash(user.password, 10);

    const { error } = await supabase
      .from("users")
      .insert({
        username: user.username,
        password_hash: passwordHash,
        display_name: user.display_name,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        console.log(`  ⚠️  User ${user.username} already exists, skipping...`);
        skippedCount++;
      } else {
        console.error(`  ❌ Error adding ${user.username}:`, error.message);
        errorCount++;
      }
    } else {
      console.log(`  ✅ Successfully added ${user.display_name}`);
      console.log(`     Username: ${user.username}`);
      console.log(`     Password: ${user.password}`);
      addedCount++;
    }
  }

  console.log("\n✨ Seed complete!");
  console.log(`   ✅ Added: ${addedCount}`);
  console.log(`   ⚠️  Skipped: ${skippedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);

  if (addedCount > 0) {
    console.log("\n🔒 IMPORTANT: All users have temporary password 'password123'");
    console.log("   Each family member should change their password after first login!");
    console.log("   Go to Settings → Change Password after logging in.");
  }
}

seed();
