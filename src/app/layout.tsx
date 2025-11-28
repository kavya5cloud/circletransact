import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
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
  title: "Circle Office - Transaction Tracker",
  description: "Circle Office comprehensive transaction management system with role-based access control and reporting features.",
  keywords: ["transaction", "tracker", "finance", "business", "management", "Circle Office"],
  authors: [{ name: "Circle Office Team" }],
  icons: {
    icon: "/circle-office-logo.png",
  },
  openGraph: {
    title: "Circle Office Transaction Tracker",
    description: "Comprehensive transaction management system",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Circle Office Transaction Tracker",
    description: "Comprehensive transaction management system",
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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
