import React, { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingState } from "@/components/shared/LoadingState";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <Suspense fallback={<LoadingState rows={8} />}>
        {children}
      </Suspense>
    </AppShell>
  );
}
