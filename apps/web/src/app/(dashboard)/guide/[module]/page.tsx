import { notFound } from "next/navigation";
import Link from "next/link";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCircleCheck,
  IconAlertTriangle,
  IconInfoCircle,
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
} from "@tabler/icons-react";

/* ─── Module Data ───────────────────────────────────────────────────────── */
const moduleData: Record<
  string,
  {
    title: string;
    icon: React.ComponentType<{ className?: string; stroke?: number }>;
    color: string;
    iconColor: string;
    overview: string[];
    workflow: { step: string; label: string; detail: string; tag?: string }[];
    stepByStep: { title: string; desc: string }[];
    keyFields: { field: string; meaning: string; gst: string }[];
    connected: { dir: "in" | "out"; module: string; note: string }[];
    faq: { q: string; a: string }[];
  }
> = {
  sales: {
    title: "Sales",
    icon: IconShoppingCart,
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    overview: [
      "The Sales module is the backbone of your revenue cycle. It lets you manage customer masters, send quotations (Estimates), confirm Sales Orders, raise GST-compliant Tax Invoices, and record Customer Payments — all in one connected flow.",
      "Every invoice automatically calculates CGST + SGST (intra-state) or IGST (inter-state) based on the Place of Supply against your GSTIN state. When goods are returned, raise a Credit Note to reverse the liability.",
      "Customer Advances can be collected upfront and later applied against invoices, keeping your receivables clean.",
    ],
    workflow: [
      { step: "1", label: "Customer Master", detail: "Add GSTIN, Place of Supply, payment terms, credit limit.", tag: "Setup" },
      { step: "2", label: "Estimate (Quotation)", detail: "Draft a quote with line items, HSN, quantities. Share via email/WhatsApp.", tag: "Quote" },
      { step: "3", label: "Sales Order", detail: "Customer confirms — convert Estimate → Sales Order. Reserve inventory.", tag: "Order" },
      { step: "4", label: "Tax Invoice", detail: "Convert SO → Invoice. CGST/SGST or IGST auto-applied. E-Invoice IRN generated.", tag: "Invoice" },
      { step: "5", label: "Customer Payment", detail: "Record payment (bank/cash/UPI). Remaining balance shows as outstanding.", tag: "Payment" },
      { step: "6", label: "Credit Note", detail: "If goods returned — raise Credit Note against Invoice to reverse tax.", tag: "Return" },
    ],
    stepByStep: [
      { title: "Create a Customer", desc: "Go to Sales → Customers → New Customer. Enter business name, GSTIN, Place of Supply, billing & shipping address. Set payment terms (e.g. Net 30) and credit limit." },
      { title: "Raise an Estimate", desc: "Sales → Estimates → New Estimate. Select customer, add items with quantities. The system auto-fills HSN codes and GST rates from Item master. Set expiry date and send." },
      { title: "Convert to Sales Order", desc: "When customer approves, open the Estimate and click 'Convert to Sales Order'. Inventory is reserved. SO can be partially fulfilled." },
      { title: "Create Invoice", desc: "From the Sales Order, click 'Create Invoice'. CGST+SGST applies if customer state = your state; IGST otherwise. Add Eway Bill number if applicable." },
      { title: "Record Payment", desc: "Sales → Customer Payments → New Payment. Select invoice(s) to apply. Remaining amount becomes outstanding receivable." },
      { title: "Issue Credit Note", desc: "If goods are returned, go to the invoice and click 'Credit Note'. Select items returned. Tax is reversed in GSTR-1 automatically." },
    ],
    keyFields: [
      { field: "Place of Supply", meaning: "State where goods/services are delivered", gst: "Determines CGST+SGST vs IGST" },
      { field: "GSTIN", meaning: "15-digit GST Identification Number of customer", gst: "Required for B2B invoices; B2C if not registered" },
      { field: "HSN Code", meaning: "Harmonised System of Nomenclature code for item", gst: "Mandatory on invoices for turnover > ₹5 Cr" },
      { field: "Tax Rate", meaning: "0% / 5% / 12% / 18% / 28%", gst: "Split equally into CGST+SGST or applied as IGST" },
      { field: "E-Invoice IRN", meaning: "Invoice Reference Number from IRP portal", gst: "Mandatory for B2B turnover > ₹5 Cr" },
      { field: "Payment Terms", meaning: "Net 30 / Due on Receipt / Custom", gst: "Controls due date shown on invoice" },
    ],
    connected: [
      { dir: "out", module: "Filing & GST → GSTR-1", note: "All B2B invoices flow into GSTR-1 auto-generation" },
      { dir: "out", module: "Banking", note: "Payments recorded are matched against bank transactions" },
      { dir: "out", module: "Accountant", note: "Invoice posting creates Debit: Receivables / Credit: Sales + GST Payable" },
      { dir: "in", module: "Inventory", note: "Items and stock availability feed into Estimates and Invoices" },
      { dir: "in", module: "Settings", note: "GSTIN, State, Tax preferences configured here" },
    ],
    faq: [
      { q: "When do I use CGST/SGST vs IGST?", a: "If your GSTIN state matches the customer's Place of Supply → CGST + SGST (each half). If different states → IGST (full rate)." },
      { q: "Can I invoice without a Sales Order?", a: "Yes. You can create invoices directly from Sales → Invoices → New Invoice without an Estimate or Sales Order." },
      { q: "What if the customer is unregistered (B2C)?", a: "Leave GSTIN blank. For B2C inter-state invoices above ₹2.5 lakh, e-way bill may be needed." },
      { q: "How do advances work?", a: "Collect advance → record in Customer Advances. When invoicing later, the advance appears as an offset against invoice amount." },
      { q: "What is a Credit Note used for?", a: "Credit Notes reverse a sales invoice — for returns, pricing corrections, or cancellations. They appear in GSTR-1 as negative entries." },
    ],
  },

  purchases: {
    title: "Purchases",
    icon: IconShoppingBag,
    color: "bg-orange-50 border-orange-200",
    iconColor: "text-orange-600",
    overview: [
      "The Purchases module mirrors the Sales cycle from a buyer's perspective. Create Vendor masters, raise Purchase Orders, receive goods and record Vendor Bills, claim Input Tax Credit (ITC), and make Vendor Payments.",
      "ITC claimed on eligible vendor bills reduces your GST payable in GSTR-3B. Debit Notes handle purchase returns. Vendor Advances track prepayments.",
      "All vendor bills post automatically to Accounts Payable and the relevant expense or asset account in your Chart of Accounts.",
    ],
    workflow: [
      { step: "A", label: "Vendor Master", detail: "Add vendor GSTIN, state, bank details, payment terms.", tag: "Setup" },
      { step: "B", label: "Purchase Order", detail: "Raise PO with items, quantities, expected delivery date.", tag: "Order" },
      { step: "C", label: "Goods Receipt", detail: "Record receipt against PO. Stock updated in Inventory.", tag: "Receive" },
      { step: "D", label: "Vendor Bill", detail: "Enter vendor's invoice. ITC auto-calculated from GST amount.", tag: "Bill" },
      { step: "E", label: "Vendor Payment", detail: "Pay vendor. TDS deducted if applicable (Sec 194C/194J).", tag: "Payment" },
      { step: "F", label: "Debit Note", detail: "If goods returned — raise Debit Note to reverse ITC.", tag: "Return" },
    ],
    stepByStep: [
      { title: "Create a Vendor", desc: "Purchases → Vendors → New Vendor. Enter name, GSTIN, Place of Supply, payment terms, and bank account for direct payment." },
      { title: "Raise a Purchase Order", desc: "Purchases → Purchase Orders → New PO. Select vendor and items. The PO is shared with the vendor for confirmation." },
      { title: "Record Goods Receipt", desc: "When goods arrive, convert PO to Goods Receipt Note (GRN). Stock levels update immediately in Inventory." },
      { title: "Create Vendor Bill", desc: "Match the GRN against vendor's invoice. Enter bill number and date. ITC-eligible CGST/SGST/IGST is auto-computed." },
      { title: "Make Vendor Payment", desc: "Purchases → Vendor Payments → New Payment. Apply to outstanding bills. TDS is deducted at source if the vendor is TDS-applicable." },
      { title: "Raise Debit Note", desc: "For returns, go to the bill and click Debit Note. ITC is reversed, and the vendor's ledger is credited." },
    ],
    keyFields: [
      { field: "Vendor GSTIN", meaning: "Supplier's GST number", gst: "Required to claim ITC. Bill appears in GSTR-2B for matching." },
      { field: "Place of Supply", meaning: "State of delivery", gst: "Determines CGST+SGST vs IGST on the vendor bill" },
      { field: "ITC Eligible", meaning: "Whether input tax credit can be claimed", gst: "Personal-use, blocked items (Sec 17(5)) are ineligible" },
      { field: "TDS Section", meaning: "194C (contracts), 194J (professionals), etc.", gst: "TDS deducted at source; deposited to govt by buyer" },
      { field: "Bill Reference", meaning: "Vendor's original invoice number", gst: "Used for matching in GSTR-2B reconciliation" },
    ],
    connected: [
      { dir: "out", module: "Filing & GST → GSTR-3B", note: "ITC from bills populates Table 4 of GSTR-3B" },
      { dir: "out", module: "Banking", note: "Vendor payments recorded are matched against bank debits" },
      { dir: "out", module: "Accountant", note: "Bills post: Debit Expense/Asset + Debit GST ITC / Credit Payables" },
      { dir: "in", module: "Inventory", note: "Goods received update stock levels" },
    ],
    faq: [
      { q: "What is ITC and how do I claim it?", a: "Input Tax Credit lets you offset GST paid on purchases against GST collected on sales. GreenNet Books auto-computes eligible ITC from vendor bills." },
      { q: "How do I match vendor bills with GSTR-2B?", a: "Go to Filing & GST → GST Reconciliation. The system compares your recorded bills against government-pushed GSTR-2B data." },
      { q: "What if the vendor is unregistered?", a: "Reverse Charge Mechanism (RCM) applies. You pay GST on behalf of the vendor and can claim it as ITC simultaneously." },
    ],
  },

  banking: {
    title: "Banking",
    icon: IconBuildingBank,
    color: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-600",
    overview: [
      "The Banking module connects your bank and cash accounts to GreenNet Books. Import or manually enter transactions, categorise them, and reconcile your books against official bank statements.",
      "Every customer payment and vendor payment automatically creates a matching bank transaction. Transfers between accounts and petty cash movements are also tracked here.",
    ],
    workflow: [
      { step: "1", label: "Add Bank Account", detail: "Link your HDFC/ICICI/SBI account with IFSC and account number.", tag: "Setup" },
      { step: "2", label: "Import Transactions", detail: "Upload bank statement CSV or use bank feed integration.", tag: "Import" },
      { step: "3", label: "Categorise", detail: "Match each transaction to an invoice, bill, or expense.", tag: "Match" },
      { step: "4", label: "Reconcile", detail: "Tick off matched items. Closing balance = bank statement balance.", tag: "Reconcile" },
      { step: "5", label: "Transfers", detail: "Record inter-account transfers (e.g. bank to petty cash).", tag: "Transfer" },
    ],
    stepByStep: [
      { title: "Add a Bank Account", desc: "Banking → Bank Accounts → Add Account. Enter bank name, IFSC, account number, and opening balance as of your books start date." },
      { title: "Import Statement", desc: "Upload a CSV export from your bank's net banking portal. GreenNet auto-parses the date, description, debit, credit, and balance columns." },
      { title: "Match Transactions", desc: "Each imported transaction is matched to an existing invoice payment or vendor payment. Unmatched items are flagged for manual categorisation." },
      { title: "Reconcile", desc: "Banking → Bank Reconciliation. Enter your bank statement closing date and balance. Tick matched entries. Any difference shows as unreconciled items." },
    ],
    keyFields: [
      { field: "Opening Balance", meaning: "Account balance on the books start date", gst: "Must match your actual bank balance on that date" },
      { field: "IFSC Code", meaning: "Indian Financial System Code", gst: "Used for NEFT/RTGS payment references" },
      { field: "Reconciliation Date", meaning: "Date up to which you are reconciling", gst: "Best practice: reconcile monthly before GST filing" },
    ],
    connected: [
      { dir: "in", module: "Sales → Customer Payments", note: "Payments create bank receipts automatically" },
      { dir: "in", module: "Purchases → Vendor Payments", note: "Payments create bank debits automatically" },
      { dir: "out", module: "Accountant → Trial Balance", note: "Reconciled bank balance flows into Balance Sheet" },
    ],
    faq: [
      { q: "What CSV format does the bank import expect?", a: "GreenNet accepts standard formats: Date | Description | Debit | Credit | Balance. Most Indian banks export in this format from net banking." },
      { q: "What if my closing balance doesn't match?", a: "Unreconciled items list shows the gap. Common causes: missing transactions, duplicate entries, or bank charges not recorded." },
    ],
  },

  accountant: {
    title: "Accountant",
    icon: IconBook2,
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-600",
    overview: [
      "GreenNet Books uses full double-entry accounting. Every Sales Invoice, Purchase Bill, Payment, and Expense creates journal entries automatically — debiting and crediting the right accounts.",
      "The Chart of Accounts (CoA) defines all your ledger heads. You can create custom ledger groups. All statutory reports — Trial Balance, P&L, Balance Sheet — are live and always current.",
      "Accountants can also post manual Journal Entries for adjustments, provisions, depreciation, and year-end closing.",
    ],
    workflow: [
      { step: "1", label: "Chart of Accounts", detail: "Setup your ledger structure (Assets, Liabilities, Income, Expenses).", tag: "Setup" },
      { step: "2", label: "Auto Journal Entries", detail: "Every invoice/payment auto-posts double-entry in the background.", tag: "Auto" },
      { step: "3", label: "Manual Journals", detail: "Post adjustments, provisions, depreciation, and accruals.", tag: "Manual" },
      { step: "4", label: "General Ledger", detail: "View all postings for any account in any date range.", tag: "View" },
      { step: "5", label: "Trial Balance", detail: "All debit/credit balances — must tally to zero.", tag: "Report" },
      { step: "6", label: "P&L / Balance Sheet", detail: "IGAAP-formatted statutory statements.", tag: "Report" },
    ],
    stepByStep: [
      { title: "Set Up Chart of Accounts", desc: "Accountant → Chart of Accounts. GreenNet provides a pre-built CoA for Indian businesses. Customise by adding sub-ledgers for each bank, creditor group, etc." },
      { title: "Review Auto Journal Entries", desc: "Accountant → Journal Entries → filter by Source = Invoice/Payment. See how every transaction debits and credits accounts." },
      { title: "Post Manual Journal", desc: "Accountant → Journal Entries → New Journal. Enter debit and credit lines. Total debits must equal total credits." },
      { title: "View General Ledger", desc: "Accountant → General Ledger → select account + date range. See every posting with running balance." },
      { title: "Generate P&L", desc: "Accountant → Profit and Loss → select period. Income less Expenses = Net Profit. Export to Excel for CA review." },
    ],
    keyFields: [
      { field: "Account Type", meaning: "Asset / Liability / Income / Expense / Equity", gst: "Controls which side of P&L or Balance Sheet it appears" },
      { field: "Journal Reference", meaning: "Auto-generated: INV-001, PAY-001, JE-001", gst: "Audit trail for every transaction" },
      { field: "Closing Period", meaning: "Month / Quarter / Year lock", gst: "Prevents back-dated entries after period close" },
    ],
    connected: [
      { dir: "in", module: "All modules", note: "Every transaction posts to the ledger automatically" },
      { dir: "out", module: "Reports", note: "Financial reports pull live from journal balances" },
      { dir: "out", module: "Filing & GST", note: "GST payable and ITC balances come from journal postings" },
    ],
    faq: [
      { q: "Do I need to know accounting to use GreenNet Books?", a: "No. For most users, all entries happen automatically. The Accountant module is for CAs and finance teams who need direct ledger access." },
      { q: "What is the difference between a Journal Entry and an Invoice?", a: "Invoices create formatted documents + auto-journals. Manual Journal Entries are for adjustments that don't have a document (provisions, corrections, etc.)." },
    ],
  },

  inventory: {
    title: "Inventory",
    icon: IconPackages,
    color: "bg-sky-50 border-sky-200",
    iconColor: "text-sky-600",
    overview: [
      "Track all your products and services in one place. Each Item has an HSN code, default GST rate, unit of measure, reorder level, and can be linked to multiple warehouses.",
      "Stock increases when you receive goods (Purchase GRN) and decreases when you ship (Sales Delivery). Stock Adjustments handle physical count differences. Transfers move stock between warehouses.",
    ],
    workflow: [
      { step: "1", label: "Create Items", detail: "Add product with HSN, GST rate, UOM, buying/selling price.", tag: "Setup" },
      { step: "2", label: "Set Opening Stock", detail: "Enter initial quantity and valuation on go-live date.", tag: "Setup" },
      { step: "3", label: "Receive Stock", detail: "Goods Receipt Note from Purchase Order increases stock.", tag: "Inward" },
      { step: "4", label: "Ship Stock", detail: "Sales Delivery from Sales Order decreases stock.", tag: "Outward" },
      { step: "5", label: "Adjust Stock", detail: "Physical count variances corrected via Stock Adjustment.", tag: "Adjust" },
      { step: "6", label: "Transfer", detail: "Move stock between warehouses / branches.", tag: "Transfer" },
    ],
    stepByStep: [
      { title: "Create an Item", desc: "Inventory → Items → New Item. Enter name, SKU, HSN code, GST rate (5/12/18/28%), unit of measure (Nos/Kg/Box), and purchase/sale price." },
      { title: "Set Opening Stock", desc: "On the Item form, enter opening quantity and per-unit cost. This establishes your initial inventory value." },
      { title: "Track Movements", desc: "Stock Movements report shows every inward and outward transaction with date, reference, and running balance." },
    ],
    keyFields: [
      { field: "HSN Code", meaning: "Harmonised System of Nomenclature for the item", gst: "Auto-fills on invoices; determines GST rate" },
      { field: "UOM", meaning: "Unit of Measure — Nos, Kg, Ltr, Box, etc.", gst: "Must match unit declared in e-way bill" },
      { field: "Reorder Level", meaning: "Stock qty below which an alert fires", gst: "No GST impact; operational control" },
      { field: "Valuation Method", meaning: "FIFO / Weighted Average", gst: "Affects COGS computation in P&L" },
    ],
    connected: [
      { dir: "in", module: "Purchases → Vendor Bills", note: "GRN increases stock on hand" },
      { dir: "in", module: "Sales → Invoices", note: "Delivery reduces stock on hand" },
      { dir: "out", module: "Reports → Inventory Reports", note: "Stock summary, valuation, movement reports" },
    ],
    faq: [
      { q: "What if I sell services, not products?", a: "Create items of type 'Service'. No stock tracking applies; SAC code is used instead of HSN." },
      { q: "Can I have multiple warehouses?", a: "Yes. Each warehouse can hold independent stock levels. Transfers between warehouses are tracked." },
    ],
  },

  expenses: {
    title: "Expenses",
    icon: IconReceipt,
    color: "bg-rose-50 border-rose-200",
    iconColor: "text-rose-600",
    overview: [
      "Record business expenses — travel, office supplies, utilities, professional fees — with receipt uploads. Each expense can carry GST for ITC claims where eligible.",
      "Multi-level approvals ensure expenses are authorized before reimbursement. Expenses flow into the P&L and can be linked to bank transactions.",
    ],
    workflow: [
      { step: "1", label: "Create Expense", detail: "Enter amount, category, date, payment mode, and GST.", tag: "Record" },
      { step: "2", label: "Attach Receipt", detail: "Upload bill image or PDF for audit trail.", tag: "Document" },
      { step: "3", label: "Submit for Approval", detail: "Route to manager for approval if workflow is enabled.", tag: "Approve" },
      { step: "4", label: "Reimbursement", detail: "Approved expenses are paid to the employee.", tag: "Pay" },
      { step: "5", label: "ITC Claim", detail: "GST on eligible expenses claimed as Input Tax Credit.", tag: "GST" },
    ],
    stepByStep: [
      { title: "Record an Expense", desc: "Expenses → New Expense. Enter merchant name, amount, date, GST amount, and category (Travel / Office / Professional Fees). Select payment mode (cash/card/bank)." },
      { title: "Attach Proof", desc: "Upload the receipt or vendor invoice. This is your audit trail." },
      { title: "Submit for Approval", desc: "If approval workflow is active, submit the expense. It moves to the manager's Approval Centre queue." },
    ],
    keyFields: [
      { field: "Expense Category", meaning: "Travel / Office / Professional Fees / etc.", gst: "Determines which expense ledger is debited" },
      { field: "GST Amount", meaning: "Tax paid on the purchase", gst: "Eligible for ITC if used for business purposes (Sec 17(5) exclusions apply)" },
    ],
    connected: [
      { dir: "out", module: "Accountant", note: "Expenses post to P&L expense accounts" },
      { dir: "out", module: "Filing & GST → ITC", note: "GST on expenses can be claimed as ITC" },
      { dir: "out", module: "Banking", note: "Paid expenses are matched against bank debits" },
    ],
    faq: [
      { q: "Can I claim GST ITC on all expenses?", a: "No. Section 17(5) blocks ITC on motor vehicles, food, club memberships, and personal expenses. GreenNet flags these categories automatically." },
    ],
  },

  gst: {
    title: "Filing & GST",
    icon: IconReceiptTax,
    color: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
    overview: [
      "GreenNet Books is built for Indian GST compliance. Every invoice, credit note, debit note, and payment automatically populates the right GST table. File GSTR-1, GSTR-3B, and reconcile ITC without manual data entry.",
      "TDS (Tax Deducted at Source) and TCS (Tax Collected at Source) are also handled — deductions computed, challans tracked, and 26Q/27Q returns prepared.",
    ],
    workflow: [
      { step: "1", label: "GST Settings", detail: "Set GSTIN, HSN codes, tax rates, Place of Supply defaults.", tag: "Setup" },
      { step: "2", label: "Transactions", detail: "All invoices auto-populate GSTR-1 / GSTR-3B tables.", tag: "Auto" },
      { step: "3", label: "GSTR-2B Match", detail: "Reconcile your purchase ITC with govt's GSTR-2B data.", tag: "Reconcile" },
      { step: "4", label: "GSTR-1", detail: "Review and file by 11th of following month (B2B + B2C).", tag: "File" },
      { step: "5", label: "GSTR-3B", detail: "File summary return by 20th. Net tax = output – ITC.", tag: "File" },
      { step: "6", label: "TDS / TCS", detail: "Compute, deduct, deposit, and file TDS returns.", tag: "TDS" },
    ],
    stepByStep: [
      { title: "Configure GST Settings", desc: "Filing & GST → GST Settings. Enter your GSTIN, state code, and business type (Regular / Composition). Enable e-invoice if turnover > ₹5 Cr." },
      { title: "Review GST Transactions", desc: "Filing & GST → GST Transactions. All invoices appear here with CGST, SGST, IGST breakup. Filter by month before filing." },
      { title: "Reconcile GSTR-2B", desc: "Upload GSTR-2B JSON from GST portal. GreenNet matches your bills against it. Mismatches are flagged for follow-up with vendors." },
      { title: "Generate and File GSTR-1", desc: "Filing & GST → GST Returns → GSTR-1. Download JSON and upload to GST portal, or use direct API filing." },
      { title: "Generate GSTR-3B", desc: "GSTR-3B is auto-compiled from your outward and inward supply data. Review Table 3 (output) and Table 4 (ITC). Pay the net liability via GST portal." },
    ],
    keyFields: [
      { field: "GSTIN", meaning: "15-digit GST ID: state code + PAN + entity + Z + checksum", gst: "Mandatory for all B2B tax invoices" },
      { field: "Place of Supply", meaning: "2-digit state code of delivery location", gst: "Determines CGST+SGST (same state) or IGST (different state)" },
      { field: "HSN / SAC", meaning: "Goods: HSN code | Services: SAC code", gst: "Determines tax rate; mandatory in GSTR-1" },
      { field: "E-Invoice IRN", meaning: "Invoice Reference Number from NIC/IRP", gst: "Generated for B2B invoices if turnover > ₹5 Cr" },
      { field: "ITC Eligible", meaning: "Whether the GST paid can be offset against liability", gst: "Subject to Sec 17(5) restrictions" },
      { field: "Reverse Charge", meaning: "Buyer pays GST instead of seller", gst: "Applies to specified services and unregistered vendor purchases" },
    ],
    connected: [
      { dir: "in", module: "Sales → Invoices", note: "B2B, B2C, Export invoices populate GSTR-1" },
      { dir: "in", module: "Purchases → Bills", note: "ITC from bills populates GSTR-3B Table 4" },
      { dir: "in", module: "Expenses", note: "Eligible expense GST flows into ITC" },
      { dir: "out", module: "Accountant", note: "GST payable and ITC balances post to respective ledgers" },
    ],
    faq: [
      { q: "What is the difference between GSTR-1 and GSTR-3B?", a: "GSTR-1 is a detail return of all outward supplies (filed by 11th). GSTR-3B is a summary return of output tax minus ITC, with actual tax payment (filed by 20th)." },
      { q: "What is RCM — Reverse Charge Mechanism?", a: "For certain specified services (legal, GTA, etc.) or purchases from unregistered vendors, the buyer must pay GST directly to the government instead of the seller." },
      { q: "How do I handle e-invoicing?", a: "If your annual turnover exceeds ₹5 Cr, GreenNet automatically generates IRN and QR codes for all B2B invoices via the IRP portal integration." },
    ],
  },

  assets: {
    title: "Fixed Assets",
    icon: IconBuildingSkyscraper,
    color: "bg-teal-50 border-teal-200",
    iconColor: "text-teal-600",
    overview: [
      "Track your company's long-term assets — machinery, computers, furniture, vehicles. Each asset is added to the register with purchase date, cost, depreciation method, and useful life.",
      "Depreciation is computed automatically (SLM or WDV as per Companies Act / Income Tax Act) and posted as monthly or annual journal entries. Asset disposal records sale or scrapping.",
    ],
    workflow: [
      { step: "1", label: "Add Asset", detail: "Enter asset name, category, purchase date, cost, and location.", tag: "Setup" },
      { step: "2", label: "Set Depreciation", detail: "Choose SLM or WDV, useful life, residual value.", tag: "Config" },
      { step: "3", label: "Auto Depreciation", detail: "Monthly depreciation JE is auto-posted.", tag: "Auto" },
      { step: "4", label: "Asset Disposal", detail: "Record sale / write-off. Profit or loss on disposal computed.", tag: "Dispose" },
    ],
    stepByStep: [
      { title: "Add a Fixed Asset", desc: "Fixed Assets → Asset Register → Add Asset. Enter purchase date, vendor, invoice number, cost, location, and assign to an asset category." },
      { title: "Configure Depreciation", desc: "Select SLM (Straight Line Method) or WDV (Written Down Value). Enter useful life (years) and residual/salvage value." },
      { title: "Run Depreciation", desc: "Fixed Assets → Depreciation → Run for Period. GreenNet posts depreciation JE: Debit Depreciation Expense / Credit Accumulated Depreciation." },
    ],
    keyFields: [
      { field: "Asset Category", meaning: "Computers / Vehicles / Furniture / Plant & Machinery", gst: "Determines depreciation rate under Companies Act" },
      { field: "Depreciation Method", meaning: "SLM (equal per year) or WDV (% on book value)", gst: "SLM for Companies Act; WDV often for Income Tax" },
      { field: "Useful Life", meaning: "Years the asset is expected to be in use", gst: "Schedule II of Companies Act prescribes standard useful lives" },
    ],
    connected: [
      { dir: "in", module: "Purchases → Bills", note: "Asset purchase bill is the source document" },
      { dir: "out", module: "Accountant", note: "Depreciation JEs post to P&L and reduce asset value on Balance Sheet" },
    ],
    faq: [
      { q: "What is the difference between SLM and WDV?", a: "SLM: same depreciation amount each year (cost / useful life). WDV: depreciation is a % of the remaining book value — higher in early years, lower later." },
    ],
  },

  reports: {
    title: "Reports",
    icon: IconChartBar,
    color: "bg-indigo-50 border-indigo-200",
    iconColor: "text-indigo-600",
    overview: [
      "GreenNet Books comes with 30+ pre-built reports across financial, sales, purchases, banking, tax, and inventory categories. All reports are real-time — no end-of-day processing needed.",
      "Export any report to Excel or PDF. Schedule reports to be emailed to stakeholders automatically.",
    ],
    workflow: [
      { step: "1", label: "Pick Report", detail: "Choose from Financial / Sales / Purchase / Tax / Inventory.", tag: "Select" },
      { step: "2", label: "Set Filters", detail: "Date range, customer, item, branch, currency.", tag: "Filter" },
      { step: "3", label: "Review", detail: "Drill down from summary to individual transactions.", tag: "Analyse" },
      { step: "4", label: "Export", detail: "Download Excel / PDF. Or schedule email delivery.", tag: "Export" },
    ],
    stepByStep: [
      { title: "Run a Sales Report", desc: "Reports → Sales Reports → Customer Outstanding. Filter by date and customer. See total invoiced, collected, and pending amounts." },
      { title: "Run P&L", desc: "Reports → Financial Reports → Profit and Loss. Select FY period. Income, Cost of Goods, Gross Profit, Operating Expenses, Net Profit all in one view." },
      { title: "Tax Summary", desc: "Reports → Tax Reports → GST Summary. See CGST, SGST, IGST totals for any period — matches GSTR-3B liability." },
    ],
    keyFields: [
      { field: "Date Range", meaning: "Filter reports by any custom or preset period", gst: "FY India: April 1 to March 31" },
      { field: "Comparative", meaning: "Show two periods side by side", gst: "Useful for YoY growth analysis" },
    ],
    connected: [
      { dir: "in", module: "All modules", note: "Reports pull live data from every module" },
    ],
    faq: [
      { q: "Can I customise reports?", a: "Yes — column selection, grouping, and sorting are configurable. Custom saved views are coming soon." },
    ],
  },

  automation: {
    title: "Automation",
    icon: IconSparkles,
    color: "bg-violet-50 border-violet-200",
    iconColor: "text-violet-600",
    overview: [
      "GreenNet AI and Automation tools reduce manual work. Set up payment reminders, approval workflows, and recurring transactions — all running in the background.",
      "The AI Assistant can answer accounting questions, suggest missing entries, flag anomalies, and help you prepare for GST filing.",
    ],
    workflow: [
      { step: "1", label: "AI Assistant", detail: "Ask questions in plain English — 'What is my outstanding receivable?'", tag: "AI" },
      { step: "2", label: "Notifications", detail: "Payment due reminders sent to customers via email/SMS/WhatsApp.", tag: "Alert" },
      { step: "3", label: "Approvals", detail: "Multi-level approval workflows for expenses and purchase orders.", tag: "Workflow" },
    ],
    stepByStep: [
      { title: "Set Up Payment Reminders", desc: "Automation → Notifications → Payment Reminders. Set trigger: 7 days before due, on due date, 3 days after. Auto-email sent to customer." },
      { title: "Configure Approval Workflow", desc: "Automation → Approval Centre. Define: Expenses above ₹10,000 require Manager approval before payment." },
    ],
    keyFields: [
      { field: "Trigger", meaning: "What event starts the automation", gst: "Invoice due date, PO raised, expense submitted, etc." },
      { field: "Action", meaning: "What happens automatically", gst: "Send email, notify user, escalate, block payment" },
    ],
    connected: [
      { dir: "in", module: "Sales → Invoices", note: "Overdue invoices trigger payment reminder workflows" },
      { dir: "in", module: "Expenses", note: "Submitted expenses enter approval workflow" },
    ],
    faq: [
      { q: "What can the AI Assistant do?", a: "Ask anything: outstanding balances, top customers, GST liability for the month, unreconciled transactions. It queries your live books and answers instantly." },
    ],
  },
};

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default async function ModuleGuidePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module: moduleId } = await params;
  const data = moduleData[moduleId];
  if (!data) notFound();

  const Icon = data.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Back */}
      <Link
        href="/guide"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <IconArrowLeft className="size-4" />
        Back to User Guide
      </Link>

      {/* Header */}
      <div className={`rounded-xl border p-5 ${data.color}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 rounded-lg bg-white/70 flex items-center justify-center">
            <Icon className={`size-6 ${data.iconColor}`} stroke={1.75} />
          </div>
          <h1 className="text-xl font-bold text-foreground">{data.title} Module Guide</h1>
        </div>
        <div className="space-y-2">
          {data.overview.map((para, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Workflow Diagram */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">📊 Workflow</h2>
        <div className="rounded-xl border bg-muted/20 p-4 overflow-x-auto">
          <div className="flex flex-wrap gap-3 min-w-max sm:min-w-0">
            {data.workflow.map((step, i) => (
              <div key={step.step} className="flex items-start gap-2">
                <div className="flex flex-col items-center">
                  <div className="size-9 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {step.step}
                  </div>
                  <div className="mt-2 text-center max-w-[110px]">
                    <div className="text-xs font-semibold text-foreground leading-tight">{step.label}</div>
                    <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">{step.detail}</div>
                    {step.tag && (
                      <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        {step.tag}
                      </span>
                    )}
                  </div>
                </div>
                {i < data.workflow.length - 1 && (
                  <IconArrowRight className="size-4 text-muted-foreground mt-2.5 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">📋 Step-by-Step Guide</h2>
        <div className="space-y-3">
          {data.stepByStep.map((step, i) => (
            <div key={i} className="rounded-lg border bg-card p-4 flex gap-3">
              <div className="size-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{step.title}</div>
                <div className="text-sm text-muted-foreground leading-relaxed mt-0.5">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Fields */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">🔑 Key Fields Explained</h2>
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Field</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">What it means</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">GST / India context</th>
              </tr>
            </thead>
            <tbody>
              {data.keyFields.map((row, i) => (
                <tr key={i} className={`border-b last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-muted/20"}`}>
                  <td className="px-4 py-2.5 font-medium text-foreground text-xs">{row.field}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">{row.meaning}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">{row.gst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Connected Modules */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">🔗 Connected Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.connected.map((conn, i) => (
            <div key={i} className="rounded-lg border bg-card p-3 flex items-start gap-2">
              {conn.dir === "in" ? (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 shrink-0">← IN</span>
              ) : (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 shrink-0">OUT →</span>
              )}
              <div>
                <div className="text-xs font-semibold text-foreground">{conn.module}</div>
                <div className="text-xs text-muted-foreground">{conn.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">❓ FAQ &amp; Common Mistakes</h2>
        <div className="space-y-3">
          {data.faq.map((item, i) => (
            <div key={i} className="rounded-lg border bg-card p-4">
              <div className="flex items-start gap-2 mb-1.5">
                <IconInfoCircle className="size-4 text-blue-500 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-foreground">{item.q}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-6">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nav links */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Link
          href="/guide"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <IconArrowLeft className="size-4" />
          All Modules
        </Link>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(moduleData).map((id) => ({ module: id }));
}
