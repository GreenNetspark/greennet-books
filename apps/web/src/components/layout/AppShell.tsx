"use client";

import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { pageVariants } from "@/lib/motion";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "228px",
          "--sidebar-width-icon": "72px",
        } as React.CSSProperties
      }
      className="flex flex-col min-h-screen w-full bg-background"
    >
      {/* Full-width Zoho Books-style Dark Topbar */}
      <Topbar />

      {/* Below Topbar: Light Sidebar + Main Content with zero dead gap */}
      <div className="flex flex-1 min-w-0 w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col min-w-0 w-full overflow-x-hidden bg-background">
          <main className="flex-1 p-4 sm:p-5 lg:p-6 w-full max-w-[1600px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
