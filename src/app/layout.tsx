import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Waitless - Modern Queue Management System",
    template: "%s | Waitless",
  },
  description:
    "Streamline your business operations with Waitless. Manage queues efficiently for hospitals, clinics, and service centers.",
  keywords: ["queue management", "waiting line", "business efficiency", "customer experience"],
  openGraph: {
    title: "Waitless - Modern Queue Management System",
    description: "Streamline your business operations with Waitless. Manage queues efficiently for hospitals, clinics, and service centers.",
    url: "https://waitless-app.vercel.app", // Replace with your actual domain
    siteName: "Waitless",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Waitless - Premium Queue Management",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Waitless | Queue Management",
    description: "Eliminate waiting lines and improve customer satisfaction.",
    images: ["/og-image.png"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              <main className="flex-1">{children}</main>
            </div>
          </ThemeProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
