# GreenNet Books

> Cloud Accounting & Financial Management SaaS for Indian Businesses by **GreenNetSpark**.

## Overview

GreenNet Books is an enterprise-grade financial management platform supporting double-entry accounting, Indian GST compliance, invoicing, banking, inventory, and advance payment management.

This repository hosts the front-end foundation built on **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

---

## Starter Task Implementation: Customer Module & App Shell

- **Branch**: `feature/customers-ui`
- **Specification**: Product Requirements Document (PRD), Functional Requirements Specification (FRS), UI/UX Specification, Software Architecture Document (SAD v2.0).

### Key Features Implemented

1. **Persistent App Shell**
   - **Config-Driven Sidebar**: 12 modular navigation groups (Overview, Sales, Purchases, Banking, Accounting, Inventory, Expenses, Taxation, Fixed Assets, Reports, Automation, Settings) built on shadcn's collapsible `Sidebar` component.
   - **Topbar with 7 Required Elements**:
     - Organization switcher (dropdown with multiple entities)
     - Branch context selector
     - Global search with keyboard shortcut (`⌘K` / `Ctrl+K`)
     - Quick Create menu (+ Customer, Invoice, Bill, Payment, Expense)
     - Notification popover with live activity count
     - Help & GST guide popup
     - User profile dropdown with role-based permissions and logout
   - **Dynamic Breadcrumbs**: Automatic path resolution (`Sales > Customers > Create Customer`).

2. **Customer List Screen (`UI-CUST-001`)**
   - Built on a reusable `DataTable` integrating **TanStack Table v8** with shadcn `Table` styling.
   - **8 Standard Columns**:
     - Customer Name (with business/individual indicator and clickable link)
     - Customer Type (Business / Individual)
     - GSTIN (monospace with state code, or `—` for unregistered)
     - Mobile (Indian format `+91 XXXXX XXXXX`)
     - Receivables (INR formatted `₹1,25,000.00`, right-aligned, `tabular-nums`)
     - Advance Balance (highlighted when active, `tabular-nums`)
     - Status (`StatusBadge` with dot indicator + accessible text)
     - Actions (dropdown: View Details, Edit, Deactivate/Activate, New Invoice)
   - **Search & Filters**:
     - Real-time search across Customer Name, GSTIN, Contact Person, Mobile, Email
     - Status Filter (All, Active, Inactive)
     - Type Filter (All, Business, Individual)
     - Has Balance filter toggle
     - **QA State Simulator**: Quick toggle between `Normal`, `Empty`, `Error`, and `Permission Restricted` states.
   - **Summary KPI Cards**: Live totals for Total Customers, Active Customers, Receivables, and Advance Liabilities.

3. **Create Customer Screen (`UI-CUST-002`)**
   - **7 Form Sections** organized into clear Cards:
     1. Basic Information (Customer Name, Customer Type)
     2. Contact Information (Contact Person, Email, 10-digit Indian Mobile)
     3. Address Information (Billing Address, Shipping Address, "Same as billing" sync)
     4. GST Information (GST Registration Type, Place of Supply across 28 Indian States/UTs, conditional GSTIN field with Motion `AnimatePresence`)
     5. Payment Terms (Due on Receipt, Net 15, Net 30, Net 45, Net 60, Credit Limit with safeguard hints)
     6. Opening Balance (Opening Balance in INR for historical ledger carry-forward)
     7. Additional Information (Customer Notes)
   - **Live Validations**:
     - React Hook Form + Zod (`customerSchema`)
     - Mandatory field indicators (red asterisk) and contextual inline errors
     - Indian 15-character GSTIN regex validation (`^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`)
     - Live duplicate customer warning (flags matching names or duplicate GSTINs)
   - **Lifecycle Actions**:
     - `Save Customer` with submission spinner and redirect
     - `Save as Draft`
     - `Cancel` with `ConfirmDialog` warning on unsaved changes
     - Sonner rich toast notifications

4. **Design System & Theme Tokens**
   - Brand Palette in `src/app/globals.css`:
     - Primary: Deep Green (`oklch(0.38 0.12 155)`)
     - Secondary: Dark Slate (`oklch(0.24 0.04 240)`)
     - Background: Light Neutral (`oklch(0.985 0.005 240)`)
     - Surface: Pure White
     - Alerts: Green (Success), Amber (Warning), Red (Destructive), Blue (Info)
   - Reusable Component Library in `src/components/shared/`:
     - `DataTable`, `SearchInput`, `StatusBadge`, `ConfirmDialog`, `PageHeader`, `SummaryCard`, `EmptyState`, `ErrorState`, `LoadingState`
   - Subtle animations in `src/lib/motion.ts` (150–250ms ease-out transitions respecting reduced motion).

---

## Getting Started

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

### Installation & Run

```bash
# 1. Clone repository and navigate to web app
cd greennet-books/apps/web

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:3000/customers
```

Alternatively, from the repository root:
```bash
npm run dev
```

### Production Build & Verification

```bash
cd apps/web
npm run build
```

---

## Directory Structure

```
apps/web/src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx            # App shell wrapper
│   │   ├── dashboard/page.tsx    # Dashboard overview
│   │   └── customers/
│   │       ├── page.tsx          # Customer List (UI-CUST-001)
│   │       └── new/page.tsx      # Create Customer (UI-CUST-002)
│   ├── globals.css               # Brand tokens & Tailwind CSS
│   ├── layout.tsx                # Root layout with TooltipProvider & Toaster
│   └── page.tsx                  # Root redirect to /customers
├── components/
│   ├── layout/                   # AppSidebar, Topbar, Breadcrumbs, PageHeader, AppShell
│   ├── shared/                   # DataTable, SearchInput, StatusBadge, ConfirmDialog, States
│   └── ui/                       # shadcn/ui customized primitives
├── config/
│   └── navigation.ts             # Sidebar navigation groups & routes config
├── features/
│   └── customers/
│       ├── components/           # CustomerColumns, CustomerFilters
│       ├── api.ts                # Mock API with in-memory persistence & simulated delays
│       ├── constants.ts          # Indian States, GST Types, Payment Terms
│       ├── mock-data.ts          # 20 realistic Indian customer records
│       └── schema.ts             # Zod validation schema
├── lib/
│   ├── formatters.ts             # formatCurrency (INR), isValidGstin, formatPhoneNumber
│   ├── motion.ts                 # Shared animation presets
│   └── utils.ts                  # cn helper
└── types/
    └── customer.ts               # Core customer TypeScript interfaces
```

---

## Next Steps (Phase 2 Roadmap)
- Customer Details screen (`UI-CUST-003`) with transactional tabs (Invoices, Payments, Advances, Credit Notes, Statement).
- Vendor Management module (reusing `DataTable`, `StatusBadge`, and form patterns).
- Sales Invoicing & GST e-invoicing integration.
- Advance allocation and liability tracking against invoices.
