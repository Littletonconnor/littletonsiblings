import Link from "next/link";
import { Heart, MessageCircle, Bell, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-headline">
            Littleton Siblings
          </h1>
          <p className="text-xl md:text-2xl text-paragraph mb-8 leading-relaxed">
            Stay connected with family through weekly check-ins
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 rounded-lg font-semibold bg-highlight text-background text-lg transition-all hover:opacity-90 hover:scale-105 shadow-lg"
          >
            Sign In
          </Link>
        </div>

        {/* What It Is Section */}
        <div className="mb-16 bg-card rounded-2xl p-8 md:p-12 shadow-lg border-2 border-secondary">
          <h2 className="text-3xl font-bold mb-6 text-headline">
            What is Littleton Siblings?
          </h2>
          <p className="text-lg text-paragraph leading-relaxed mb-4">
            Littleton Siblings is a private family app designed to help our
            family stay connected, no matter where life takes us. Every week,
            each family member shares a quick update about their week - the
            highs, the lows, and everything in between.
          </p>
          <p className="text-lg text-paragraph leading-relaxed">
            It's our way of making sure we're there for each other, celebrating
            the wins and supporting through the challenges, even when we can't
            be together in person.
          </p>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-headline">
            How It Works
          </h2>
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-md border-2 border-secondary">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-highlight text-background flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-headline">
                    Share Your Week
                  </h3>
                  <p className="text-paragraph leading-relaxed">
                    Each week, log in and submit a quick message about how your
                    week went. Pick an emoji that represents your mood (from 😔
                    to 😄) and share what's been happening in your life.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 md:p-8 shadow-md border-2 border-secondary">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-highlight text-background flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-headline">
                    Read Family Updates
                  </h3>
                  <p className="text-paragraph leading-relaxed">
                    Browse through everyone's check-ins to see how your siblings
                    are doing. Celebrate the good times and reach out when
                    someone's having a tough week.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 md:p-8 shadow-md border-2 border-secondary">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-highlight text-background flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-headline">
                    Get Weekly Summaries
                  </h3>
                  <p className="text-paragraph leading-relaxed">
                    Every Sunday evening, receive an SMS summary of everyone's
                    weekly updates. If you forget to check in, you'll get a
                    friendly reminder on Monday morning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-secondary py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-paragraph text-sm">
            A private family app for the Littleton siblings 💙
          </p>
        </div>
      </div>
    </div>
  );
}
