import type { Metadata } from "next";
import { SessionProvider } from "@/components/SessionProvider";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Littleton Siblings Health Check",
  description: "Weekly check-ins for the family",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
