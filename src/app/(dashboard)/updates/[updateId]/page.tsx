"use client";

import * as React from "react";
import { Calendar, User as UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Update, User } from "@/lib/types";

const QUERY_KEY = "updateId";

const scoreEmojis = {
  1: "😔",
  2: "😐",
  3: "🙂",
  4: "😄",
};

const scoreLabels = {
  1: "Really tough",
  2: "Challenging",
  3: "Pretty good!",
  4: "Amazing!",
};

export default function SubmitPage() {
  const { status } = useSession();
  const [data, setData] = React.useState<(Update & { users: User }) | null>();
  const params = useParams();
  const updateId = params.updateId;
  const router = useRouter();

  useEffect(() => {
    async function fetchUpdate() {
      const response = await fetch(`/api/updates?${QUERY_KEY}=${updateId}`);
      const { data } = await response.json();
      setData(data);
    }
    fetchUpdate();
  }, [updateId]);

  if (status === "loading" || !data) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
        <div className="text-paragraph">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  console.log("UPDATE", data);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatWeekDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto flex justify-center p-8 bg-background">
      <div className="bg-card rounded-xl p-6 shadow-md border-2 border-secondary">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-headline font-semibold">
              <UserIcon className="w-4 h-4" />
              <span>{data.users.display_name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-3xl">
                {scoreEmojis[data.score as keyof typeof scoreEmojis]}
              </span>
              <span className="text-sm text-paragraph">
                {scoreLabels[data.score as keyof typeof scoreLabels]}
              </span>
            </div>
          </div>
        </div>
        <p className="text-paragraph mb-4 text-base leading-relaxed">
          {data.message}
        </p>
        <div className="flex items-center space-x-4 text-xs text-paragraph">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Week of {formatWeekDate(data.week_start_date)}</span>
          </div>
          <span>•</span>
          {data.created_at && (
            <span>Submitted {formatDate(data.created_at)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
