"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, User } from "lucide-react";
import Link from "next/link";

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

interface Update {
  id: string;
  displayName: string;
  message: string;
  score: number;
  createdAt: string;
  weekStartDate: string;
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "authenticated") {
      fetchHistory();
    }
  }, [status, router]);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history");
      if (response.ok) {
        const data = await response.json();
        setUpdates(data);
      } else {
        setError("Failed to load history");
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-paragraph">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

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
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-headline mb-2">
            Check-in History
          </h1>
          <p className="text-paragraph">
            All family check-ins from everyone 💙
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-secondary text-headline">
            {error}
          </div>
        )}

        {updates.length === 0 && !error ? (
          <div className="text-center py-12 bg-card rounded-2xl">
            <p className="text-paragraph text-lg">No check-ins yet!</p>
            <p className="text-paragraph text-sm mt-2">
              Be the first to submit one 😊
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {updates.map((update) => (
              <div
                key={update.id}
                className="bg-card rounded-xl p-6 shadow-md border-2 border-secondary hover:border-highlight transition-colors"
              >
                <Link href={`updates/${update.id}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 text-headline font-semibold">
                        <User className="w-4 h-4" />
                        <span>{update.displayName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-3xl">
                          {
                            scoreEmojis[
                              update.score as keyof typeof scoreEmojis
                            ]
                          }
                        </span>
                        <span className="text-sm text-paragraph">
                          {
                            scoreLabels[
                              update.score as keyof typeof scoreLabels
                            ]
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-paragraph mb-4 text-base leading-relaxed">
                    {update.message}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-paragraph">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Week of {formatWeekDate(update.weekStartDate)}
                      </span>
                    </div>
                    <span>•</span>
                    <span>Submitted {formatDate(update.createdAt)}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
