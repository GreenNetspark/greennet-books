import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, ArrowRight, TrendingUp, IndianRupee, ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Consolidated financial and accounting overview for GreenNet Books."
        actions={
          <Button render={<Link href="/customers/new" />}>
            <UserPlus className="size-4 mr-2" />
            Create Customer
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Receivables</CardTitle>
            <IndianRupee className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">₹18,45,200.00</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="size-3 text-emerald-600" />
              <span>+12.4% from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Customer Advances</CardTitle>
            <IndianRupee className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">₹2,85,000.00</div>
            <p className="text-xs text-muted-foreground mt-1">Available for allocation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Active Customers</CardTitle>
            <Users className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">18</div>
            <p className="text-xs text-muted-foreground mt-1">2 individual, 16 business</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">GST Status</CardTitle>
            <ShieldCheck className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Compliant</div>
            <p className="text-xs text-muted-foreground mt-1">GSTR-1 & 3B synced</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed bg-muted/20">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Customers Module Ready</CardTitle>
          <CardDescription>
            The Customers module has been implemented with full App Shell, Indian GSTIN validation, advance tracking, search, and filtering.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button render={<Link href="/customers" className="gap-2" />}>
            Go to Customer List
            <ArrowRight className="size-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
