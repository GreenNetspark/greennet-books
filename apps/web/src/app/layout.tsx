import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "GreenNet Books - Cloud Accounting & Financial Management",
  description: "Unified financial management and accounting platform for Indian businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider>
          {children}
          <Toaster position="bottom-right" visibleToasts={2} duration={2500} richColors />
        </TooltipProvider>
      </body>
    </html>
  );
}
