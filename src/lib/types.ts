import { Database } from "@/types/supabase";

export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export type Update = Database["public"]["Tables"]["updates"]["Row"];
export type UpdateInsert = Database["public"]["Tables"]["updates"]["Insert"];
export type UpdateUpdate = Database["public"]["Tables"]["updates"]["Update"];

export type UpdateWithUser = Update & {
  users: Pick<User, "display_name">;
};

export type Score = 1 | 2 | 3 | 4;

export const SCORE_EMOJIS: Record<Score, string> = {
  1: "😔",
  2: "😐",
  3: "🙂",
  4: "😄",
} as const;

export const SCORE_LABELS: Record<Score, string> = {
  1: "Really tough",
  2: "Challenging",
  3: "Pretty good!",
  4: "Amazing!",
} as const;
