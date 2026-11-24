# Design System & Visual Authority

## Mode
**Operate** (Enterprise Financial Software)
Key focus: Data density, readability, financial precision, consistent navigation, and clear feedback. Decorative fluff and overstimulating gradients are avoided in favor of high-clarity business interfaces.

## Brand Identity & Colors

### Color Palette
- **Primary**: Deep Green (`oklch(0.38 0.12 155)` / `#065f46`) — Represents financial trust, precision, and growth.
- **Secondary / Headings**: Dark Slate (`oklch(0.24 0.04 240)` / `#1e293b`) — Professional enterprise contrast.
- **Background**: Light Neutral (`oklch(0.985 0.005 240)` / `#f8fafc`) — Low eye strain for all-day accounting tasks.
- **Card / Surface**: Pure White (`#ffffff`) — Structured container contrast.
- **Border**: Slate Grey (`oklch(0.90 0.01 240)` / `#e2e8f0`).
- **Sidebar**: Deep Slate (`oklch(0.18 0.04 240)`) with Emerald highlights.

### Functional Alert Tokens
- **Success**: Emerald Green (`oklch(0.60 0.18 145)`) — Active status badges, completed payments, reconciliations.
- **Warning**: Amber (`oklch(0.72 0.17 65)`) — Credit limit alerts, due date notices, pending approvals.
- **Destructive**: Red (`oklch(0.57 0.22 27)`) — Field validation errors, voided invoices, negative adjustments.
- **Information**: Blue (`oklch(0.58 0.20 250)`) — Advance payment tracking, statutory hints.

## Typography & Numbers
- **Font**: Inter (system fallback).
- **Financial Numbers**: Always use tabular numerals (`tabular-nums`) and right-alignment in tables for vertical column comparison.
- **Currency Format**: Indian Rupee (`₹`) using Indian numbering system (e.g. `₹1,25,000.00` via `Intl.NumberFormat('en-IN')`).
- **GSTIN & Codes**: Formatted in monospace (`font-mono`) uppercase for character distinction.

## Component Architecture
- Primitives live in `src/components/ui/` (customized shadcn/ui with Base UI).
- Reusable domain wrappers live in `src/components/shared/` (`DataTable`, `StatusBadge`, `SearchInput`, `ConfirmDialog`, `SummaryCard`).
- Every critical action has an explicit text label (not an icon alone).
- Statuses are distinguishable by more than color (status badge includes icon/dot indicator + explicit text).
- Motion: Purposeful 150–250ms ease-out transitions (`lib/motion.ts`), strictly respecting reduced-motion preferences.
