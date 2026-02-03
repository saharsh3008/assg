import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Assuming standard next.js fonts
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Healthcare GenAI Assistant",
    description: "AI-powered medical document analysis and reporting",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn(inter.className, "antialiased min-h-screen bg-background text-foreground")}>
                {children}
            </body>
        </html>
    );
}
