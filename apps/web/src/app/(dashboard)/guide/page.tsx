import Link from "next/link";
import {
  IconShoppingCart,
  IconShoppingBag,
  IconBuildingBank,
  IconBook2,
  IconPackages,
  IconReceipt,
  IconReceiptTax,
  IconBuildingSkyscraper,
  IconChartBar,
  IconSparkles,
  IconArrowRight,
  IconCircleCheck,
} from "@tabler/icons-react";

const modules = [
  {
    id: "sales",
    title: "Sales",
    icon: IconShoppingCart,
    color: "bg-blue-50 border-blue-200 text-blue-700",
    iconColor: "text-blue-600",
    description:
      "Manage customers, create estimates, track sales orders, raise invoices and collect payments with GST auto-calculation.",
    items: ["Customers", "Estimates", "Sales Orders", "Invoices", "Credit Notes", "Customer Payments", "Customer Advances"],
  },
  {
    id: "purchases",
    title: "Purchases",
    icon: IconShoppingBag,
    color: "bg-orange-50 border-orange-200 text-orange-700",
    iconColor: "text-orange-600",
    description:
      "Manage vendors, raise purchase orders, record bills, debit notes, and vendor payments for seamless procurement.",
    items: ["Vendors", "Purchase Orders", "Vendor Bills", "Debit Notes", "Vendor Payments", "Vendor Advances"],
  },
  {
    id: "banking",
    title: "Banking",
    icon: IconBuildingBank,
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    iconColor: "text-emerald-600",
    description:
      "Connect bank accounts, categorise transactions, and reconcile bank statements effortlessly.",
    items: ["Bank Accounts", "Cash Accounts", "Bank Transactions", "Bank Reconciliation", "Transfers"],
  },
  {
    id: "accountant",
    title: "Accountant",
    icon: IconBook2,
    color: "bg-purple-50 border-purple-200 text-purple-700",
    iconColor: "text-purple-600",
    description:
      "Full double-entry accounting — chart of accounts, journal entries, ledger, and statutory financial statements.",
    items: ["Chart of Accounts", "Journal Entries", "General Ledger", "Trial Balance", "Profit & Loss", "Balance Sheet"],
  },
  {
    id: "inventory",
    title: "Inventory",
    icon: IconPackages,
    color: "bg-sky-50 border-sky-200 text-sky-700",
    iconColor: "text-sky-600",
    description:
      "Track items, categories, warehouses, stock movements, adjustments, and inter-branch transfers in real time.",
    items: ["Items", "Item Categories", "Warehouses", "Stock Movements", "Stock Adjustments", "Stock Transfers"],
  },
  {
    id: "expenses",
    title: "Expenses",
    icon: IconReceipt,
    color: "bg-rose-50 border-rose-200 text-rose-700",
    iconColor: "text-rose-600",
    description:
      "Record, categorise, and approve business expenses with GST Input Tax Credit claims.",
    items: ["Expenses", "Expense Categories", "Expense Approvals"],
  },
  {
    id: "gst",
    title: "Filing & GST",
    icon: IconReceiptTax,
    color: "bg-amber-50 border-amber-200 text-amber-700",
    iconColor: "text-amber-600",
    description:
      "Auto-generate GSTR-1, GSTR-3B, manage ITC, TDS/TCS, and file returns directly from GreenNet Books.",
    items: ["GST Settings", "GST Transactions", "Input Tax Credit", "GST Reconciliation", "GST Returns", "TDS & TCS"],
  },
  {
    id: "assets",
    title: "Fixed Assets",
    icon: IconBuildingSkyscraper,
    color: "bg-teal-50 border-teal-200 text-teal-700",
    iconColor: "text-teal-600",
    description:
      "Maintain an asset register, compute depreciation (SLM/WDV), and record asset disposals.",
    items: ["Asset Register", "Depreciation", "Asset Disposal"],
  },
  {
    id: "reports",
    title: "Reports",
    icon: IconChartBar,
    color: "bg-indigo-50 border-indigo-200 text-indigo-700",
    iconColor: "text-indigo-600",
    description:
      "30+ pre-built financial, sales, purchase, banking, tax, and inventory reports with export to Excel / PDF.",
    items: ["Financial Reports", "Sales Reports", "Purchase Reports", "Tax Reports", "Inventory Reports"],
  },
  {
    id: "automation",
    title: "Automation",
    icon: IconSparkles,
    color: "bg-violet-50 border-violet-200 text-violet-700",
    iconColor: "text-violet-600",
    description:
      "Let GreenNet AI handle reminders, approval workflows, and recurring transactions automatically.",
    items: ["AI Assistant", "Notifications", "Approval Centre"],
  },
];

const salesFlow = [
  { step: "1", label: "Customer", sub: "Create master" },
  { step: "2", label: "Estimate", sub: "Quote & share" },
  { step: "3", label: "Sales Order", sub: "Confirm order" },
  { step: "4", label: "Invoice", sub: "CGST/SGST/IGST" },
  { step: "5", label: "Payment", sub: "Collect & record" },
];

const purchaseFlow = [
  { step: "A", label: "Vendor", sub: "Create master" },
  { step: "B", label: "Purchase Order", sub: "Request goods" },
  { step: "C", label: "Bill", sub: "Record invoice" },
  { step: "D", label: "ITC", sub: "Claim GST credit" },
  { step: "E", label: "Payment", sub: "Pay & close" },
];

export default function GuidePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">GreenNet Books — User Guide</h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          A complete reference for every module. Learn how each section works, how they connect, and
          how to handle end-to-end Indian GST accounting workflows.
        </p>
      </div>

      {/* Master Workflow Banner */}
      <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
        <h2 className="text-base font-semibold text-blue-900 mb-4">📊 End-to-End Business Workflow</h2>

        <div className="space-y-4">
          {/* Sales chain */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">Sales Cycle</p>
            <div className="flex flex-wrap items-center gap-2">
              {salesFlow.map((s, i) => (
                <div key={s.step} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="size-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      {s.step}
                    </div>
                    <span className="text-xs font-medium text-blue-900 mt-1">{s.label}</span>
                    <span className="text-[10px] text-blue-500">{s.sub}</span>
                  </div>
                  {i < salesFlow.length - 1 && (
                    <IconArrowRight className="size-4 text-blue-400 mb-4" />
                  )}
                </div>
              ))}
              <div className="flex items-center gap-2">
                <IconArrowRight className="size-4 text-blue-400 mb-4" />
                <div className="flex flex-col items-center">
                  <div className="size-8 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center">CN</div>
                  <span className="text-xs font-medium text-blue-900 mt-1">Credit Note</span>
                  <span className="text-[10px] text-blue-500">If returned</span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase chain */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-2">Purchase Cycle</p>
            <div className="flex flex-wrap items-center gap-2">
              {purchaseFlow.map((s, i) => (
                <div key={s.step} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="size-8 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                      {s.step}
                    </div>
                    <span className="text-xs font-medium text-orange-900 mt-1">{s.label}</span>
                    <span className="text-[10px] text-orange-400">{s.sub}</span>
                  </div>
                  {i < purchaseFlow.length - 1 && (
                    <IconArrowRight className="size-4 text-orange-400 mb-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* GST / Banking */}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-blue-100">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <IconCircleCheck className="size-4 text-emerald-500" />
              <span>Invoices &amp; Bills → <strong>GST Transactions</strong> → GSTR-1 / GSTR-3B</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <IconCircleCheck className="size-4 text-emerald-500" />
              <span>Payments → <strong>Bank Reconciliation</strong> → Trial Balance</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <IconCircleCheck className="size-4 text-emerald-500" />
              <span>All transactions → <strong>Profit &amp; Loss</strong> + <strong>Balance Sheet</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">Explore Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.id}
                href={`/guide/${mod.id}`}
                className="group block rounded-xl border bg-card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`size-10 rounded-lg flex items-center justify-center ${mod.color} border`}>
                      <Icon className={`size-5 ${mod.iconColor}`} stroke={1.75} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">{mod.items.length} sub-modules</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{mod.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {mod.items.slice(0, 4).map((item) => (
                      <span
                        key={item}
                        className="text-[10.5px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium"
                      >
                        {item}
                      </span>
                    ))}
                    {mod.items.length > 4 && (
                      <span className="text-[10.5px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                        +{mod.items.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-4 py-2.5 border-t bg-muted/30 flex items-center justify-between">
                  <span className="text-xs text-primary font-medium">View Guide</span>
                  <IconArrowRight className="size-3.5 text-primary" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="rounded-xl border bg-amber-50 border-amber-100 p-5">
        <h2 className="text-sm font-semibold text-amber-900 mb-3">💡 Getting Started — Quick Tips</h2>
        <ul className="space-y-2 text-xs text-amber-800">
          <li className="flex gap-2"><span className="font-bold">1.</span> Start with <strong>Settings → Organization</strong> to set your GSTIN, state, and financial year.</li>
          <li className="flex gap-2"><span className="font-bold">2.</span> Create your <strong>Customers</strong> and <strong>Vendors</strong> before raising any transactions.</li>
          <li className="flex gap-2"><span className="font-bold">3.</span> Add <strong>Items</strong> in Inventory with HSN codes and default GST rates to auto-fill invoices.</li>
          <li className="flex gap-2"><span className="font-bold">4.</span> Link your <strong>Bank Account</strong> so payments are matched and reconciled automatically.</li>
          <li className="flex gap-2"><span className="font-bold">5.</span> File <strong>GSTR-1</strong> by the 11th and <strong>GSTR-3B</strong> by the 20th of every month to stay compliant.</li>
        </ul>
      </div>
    </div>
  );
}
