"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const scoreOptions = [
  { value: 1, emoji: "😔", label: "Really tough" },
  { value: 2, emoji: "😐", label: "Challenging" },
  { value: 3, emoji: "🙂", label: "Pretty good!" },
  { value: 4, emoji: "😄", label: "Amazing!" },
];

export default function SubmitPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fffffe" }}>
        <div style={{ color: "#594a4e" }}>Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!score || !message.trim()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/updates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, score }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          signOut({ callbackUrl: "/" });
        }, 3000);
      } else {
        alert("Failed to submit update. Please try again.");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#fffffe" }}>
        <div className="text-center">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#33272a" }}>
            Thanks for checking in!
          </h2>
          <p style={{ color: "#594a4e" }}>
            See you next week 💙
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#fffffe" }}>
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl shadow-lg p-8" style={{ backgroundColor: "#faeee7" }}>
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#33272a" }}>
              How was your week, {session?.user?.name}?
            </h1>
            <p style={{ color: "#594a4e" }}>
              Share what's been going on 💭
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: "#33272a" }}>
                Your week in a nutshell
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-highlight transition-colors resize-none"
                style={{
                  backgroundColor: "#fffffe",
                  borderColor: "#ffc6c7",
                  color: "#33272a"
                }}
                placeholder="Tell us about your week..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: "#33272a" }}>
                How would you rate your week?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {scoreOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setScore(option.value)}
                    className="p-4 rounded-xl border-2 transition-all hover:scale-105"
                    style={{
                      backgroundColor: score === option.value ? "#ff8ba7" : "#fffffe",
                      borderColor: score === option.value ? "#ff8ba7" : "#ffc6c7",
                      color: score === option.value ? "#fffffe" : "#33272a",
                    }}
                  >
                    <div className="text-4xl mb-2">{option.emoji}</div>
                    <div className="text-sm font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !score || !message.trim()}
              className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#ff8ba7", color: "#fffffe" }}
            >
              {loading ? "Submitting..." : "Submit Check-in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
