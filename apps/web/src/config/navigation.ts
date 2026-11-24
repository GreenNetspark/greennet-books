import {
  LayoutDashboard,
  ShoppingCart,
  ShoppingBag,
  Landmark,
  BookOpen,
  Package,
  Receipt,
  Calculator,
  Building,
  BarChart3,
  Bot,
  Settings,
  LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  href: string;
  badge?: string;
  isComingSoon?: boolean;
}

export interface NavGroup {
  title: string;
  icon: LucideIcon;
  href?: string;
  items?: NavSubItem[];
  defaultOpen?: boolean;
}

export const navigationConfig: NavGroup[] = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Sales",
    icon: ShoppingCart,
    defaultOpen: true,
    items: [
      { title: "Customers", href: "/customers" },
      { title: "Estimates", href: "/sales/estimates", isComingSoon: true },
      { title: "Sales Orders", href: "/sales/orders", isComingSoon: true },
      { title: "Invoices", href: "/sales/invoices", isComingSoon: true },
      { title: "Credit Notes", href: "/sales/credit-notes", isComingSoon: true },
      { title: "Customer Payments", href: "/sales/payments", isComingSoon: true },
      { title: "Customer Advances", href: "/sales/advances", isComingSoon: true },
    ],
  },
  {
    title: "Purchases",
    icon: ShoppingBag,
    items: [
      { title: "Vendors", href: "/purchases/vendors", isComingSoon: true },
      { title: "Purchase Orders", href: "/purchases/orders", isComingSoon: true },
      { title: "Vendor Bills", href: "/purchases/bills", isComingSoon: true },
      { title: "Debit Notes", href: "/purchases/debit-notes", isComingSoon: true },
      { title: "Vendor Payments", href: "/purchases/payments", isComingSoon: true },
      { title: "Vendor Advances", href: "/purchases/advances", isComingSoon: true },
    ],
  },
  {
    title: "Banking",
    icon: Landmark,
    items: [
      { title: "Bank Accounts", href: "/banking/accounts", isComingSoon: true },
      { title: "Cash Accounts", href: "/banking/cash", isComingSoon: true },
      { title: "Bank Transactions", href: "/banking/transactions", isComingSoon: true },
      { title: "Bank Reconciliation", href: "/banking/reconciliation", isComingSoon: true },
      { title: "Transfers", href: "/banking/transfers", isComingSoon: true },
    ],
  },
  {
    title: "Accounting",
    icon: BookOpen,
    items: [
      { title: "Chart of Accounts", href: "/accounting/coa", isComingSoon: true },
      { title: "Journal Entries", href: "/accounting/journals", isComingSoon: true },
      { title: "General Ledger", href: "/accounting/ledger", isComingSoon: true },
      { title: "Trial Balance", href: "/accounting/trial-balance", isComingSoon: true },
      { title: "Profit and Loss", href: "/accounting/pnl", isComingSoon: true },
      { title: "Balance Sheet", href: "/accounting/balance-sheet", isComingSoon: true },
      { title: "Cash Flow Statement", href: "/accounting/cash-flow", isComingSoon: true },
      { title: "Accounting Periods", href: "/accounting/periods", isComingSoon: true },
    ],
  },
  {
    title: "Inventory",
    icon: Package,
    items: [
      { title: "Items", href: "/inventory/items", isComingSoon: true },
      { title: "Item Categories", href: "/inventory/categories", isComingSoon: true },
      { title: "Warehouses", href: "/inventory/warehouses", isComingSoon: true },
      { title: "Stock Movements", href: "/inventory/movements", isComingSoon: true },
      { title: "Stock Adjustments", href: "/inventory/adjustments", isComingSoon: true },
      { title: "Stock Transfers", href: "/inventory/transfers", isComingSoon: true },
    ],
  },
  {
    title: "Expenses",
    icon: Receipt,
    items: [
      { title: "Expenses", href: "/expenses", isComingSoon: true },
      { title: "Expense Categories", href: "/expenses/categories", isComingSoon: true },
      { title: "Expense Approvals", href: "/expenses/approvals", isComingSoon: true },
    ],
  },
  {
    title: "Taxation",
    icon: Calculator,
    items: [
      { title: "GST Settings", href: "/taxation/gst-settings", isComingSoon: true },
      { title: "GST Transactions", href: "/taxation/gst-transactions", isComingSoon: true },
      { title: "Input Tax Credit", href: "/taxation/itc", isComingSoon: true },
      { title: "GST Reconciliation", href: "/taxation/gst-reconciliation", isComingSoon: true },
      { title: "GST Returns", href: "/taxation/gst-returns", isComingSoon: true },
      { title: "TDS and TCS", href: "/taxation/tds-tcs", isComingSoon: true },
    ],
  },
  {
    title: "Fixed Assets",
    icon: Building,
    items: [
      { title: "Asset Register", href: "/assets/register", isComingSoon: true },
      { title: "Depreciation", href: "/assets/depreciation", isComingSoon: true },
      { title: "Asset Disposal", href: "/assets/disposal", isComingSoon: true },
    ],
  },
  {
    title: "Reports",
    icon: BarChart3,
    items: [
      { title: "Financial Reports", href: "/reports/financial", isComingSoon: true },
      { title: "Sales Reports", href: "/reports/sales", isComingSoon: true },
      { title: "Purchase Reports", href: "/reports/purchases", isComingSoon: true },
      { title: "Banking Reports", href: "/reports/banking", isComingSoon: true },
      { title: "Advance Reports", href: "/reports/advances", isComingSoon: true },
      { title: "Tax Reports", href: "/reports/tax", isComingSoon: true },
      { title: "Inventory Reports", href: "/reports/inventory", isComingSoon: true },
    ],
  },
  {
    title: "Automation",
    icon: Bot,
    items: [
      { title: "AI Assistant", href: "/automation/ai", isComingSoon: true },
      { title: "Notifications", href: "/automation/notifications", isComingSoon: true },
      { title: "Approval Centre", href: "/automation/approvals", isComingSoon: true },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    items: [
      { title: "Organization", href: "/settings/organization", isComingSoon: true },
      { title: "Branches", href: "/settings/branches", isComingSoon: true },
      { title: "Users and Roles", href: "/settings/users", isComingSoon: true },
      { title: "Preferences", href: "/settings/preferences", isComingSoon: true },
      { title: "Integrations", href: "/settings/integrations", isComingSoon: true },
      { title: "Subscription", href: "/settings/subscription", isComingSoon: true },
    ],
  },
];
