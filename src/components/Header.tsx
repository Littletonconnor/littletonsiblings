"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Heart, LogIn, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <header className="bg-card border-b-2 border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <Heart className="w-6 h-6 text-highlight group-hover:scale-110 transition-transform" fill="#ff8ba7" />
              <span className="text-xl font-bold text-headline">Littleton Siblings</span>
            </Link>

            {session && (
              <nav className="hidden sm:flex space-x-4">
                <Link
                  href="/submit"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/submit"
                      ? "bg-highlight text-background"
                      : "text-paragraph hover:bg-secondary"
                  }`}
                >
                  Submit
                </Link>
                <Link
                  href="/history"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/history"
                      ? "bg-highlight text-background"
                      : "text-paragraph hover:bg-secondary"
                  }`}
                >
                  History
                </Link>
                <Link
                  href="/settings"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/settings"
                      ? "bg-highlight text-background"
                      : "text-paragraph hover:bg-secondary"
                  }`}
                >
                  Settings
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="text-sm text-paragraph">Loading...</div>
            ) : session ? (
              <>
                <span className="text-sm text-paragraph hidden sm:inline">
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-highlight text-background hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn()}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-highlight text-background hover:opacity-90 transition-opacity text-sm font-medium"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {session && (
        <nav className="sm:hidden border-t border-secondary">
          <div className="flex px-4 py-2 space-x-2">
            <Link
              href="/submit"
              className={`flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/submit"
                  ? "bg-highlight text-background"
                  : "text-paragraph bg-background"
              }`}
            >
              Submit
            </Link>
            <Link
              href="/history"
              className={`flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/history"
                  ? "bg-highlight text-background"
                  : "text-paragraph bg-background"
              }`}
            >
              History
            </Link>
            <Link
              href="/settings"
              className={`flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/settings"
                  ? "bg-highlight text-background"
                  : "text-paragraph bg-background"
              }`}
            >
              Settings
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
