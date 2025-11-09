"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const QUERY_KEY = "updateId";

export default function SubmitPage() {
  const { data, status } = useSession();
  const params = useParams();
  const updateId = params.updateId;
  const router = useRouter();

  useEffect(() => {
    async function fetchUpdates() {
      const response = await fetch(`/api/updates?${QUERY_KEY}=${updateId}`);
      const data = await response.json();
      console.log("DATA", data);
    }
    fetchUpdates();
  }, [updateId]);

  if (status === "loading") {
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

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-background">
      Here are some updates
    </div>
  );
}
