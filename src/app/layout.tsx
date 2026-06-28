import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VibeTrading — AI-Powered Trading Research Workspace",
  description:
    "An open-source AI-powered trading research workspace. Chat with an autonomous agent, explore 456+ alpha factors, run paper trades, analyze your broker journal, and orchestrate multi-agent swarms — all in your browser.",
  keywords: [
    "AI trading",
    "LLM agent",
    "quantitative finance",
    "alpha factors",
    "paper trading",
    "Next.js",
    "Vibe-Trading",
    "trading research",
  ],
  authors: [{ name: "KeshavCracks" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "VibeTrading — AI-Powered Trading Research Workspace",
    description:
      "Chat with an autonomous agent, explore 456+ alpha factors, run paper trades, and orchestrate multi-agent swarms.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeTrading — AI-Powered Trading Research Workspace",
    description:
      "Chat with an autonomous agent, explore 456+ alpha factors, run paper trades, and orchestrate multi-agent swarms.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
