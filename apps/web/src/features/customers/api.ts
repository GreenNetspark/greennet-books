import { Customer } from "@/types/customer";
import { INITIAL_MOCK_CUSTOMERS } from "./mock-data";
import { CustomerFormValues } from "./schema";

// In-memory store initialized with mock data
let customersStore: Customer[] = [...INITIAL_MOCK_CUSTOMERS];

export interface GetCustomersParams {
  query?: string;
  status?: string; // "all" | "active" | "inactive"
  type?: string;   // "all" | "business" | "individual"
  hasBalance?: boolean;
  stateOverride?: "normal" | "empty" | "error" | "permission_denied";
}

export interface CustomersResponse {
  data: Customer[];
  total: number;
  summary: {
    totalReceivables: number;
    totalAdvances: number;
    activeCount: number;
    totalCount: number;
  };
}

/**
 * Fetch customers with filtering, search, and simulated network delay
 */
export async function getCustomers(
  params: GetCustomersParams = {}
): Promise<CustomersResponse> {
  // Simulate 350ms network delay
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Handle simulated states for QA / development testing
  if (params.stateOverride === "error") {
    throw new Error("Failed to load customer records from financial engine.");
  }
  if (params.stateOverride === "permission_denied") {
    throw new Error("PERMISSION_DENIED: You do not have permissions to view customer accounts.");
  }
  if (params.stateOverride === "empty") {
    return {
      data: [],
      total: 0,
      summary: {
        totalReceivables: 0,
        totalAdvances: 0,
        activeCount: 0,
        totalCount: 0,
      },
    };
  }

  let filtered = [...customersStore];

  // 1. Search Query (name, contactPerson, email, mobile, gstin)
  if (params.query && params.query.trim()) {
    const q = params.query.trim().toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.contactPerson.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        (c.gstin && c.gstin.toLowerCase().includes(q))
    );
  }

  // 2. Status Filter
  if (params.status && params.status !== "all") {
    filtered = filtered.filter((c) => c.status === params.status);
  }

  // 3. Type Filter
  if (params.type && params.type !== "all") {
    filtered = filtered.filter((c) => c.type === params.type);
  }

  // 4. Has Balance Filter
  if (params.hasBalance) {
    filtered = filtered.filter((c) => c.receivables > 0 || c.advanceBalance > 0);
  }

  // Calculate summary metrics across all records in the store
  const totalReceivables = customersStore.reduce((acc, c) => acc + (c.receivables || 0), 0);
  const totalAdvances = customersStore.reduce((acc, c) => acc + (c.advanceBalance || 0), 0);
  const activeCount = customersStore.filter((c) => c.status === "active").length;

  return {
    data: filtered,
    total: filtered.length,
    summary: {
      totalReceivables,
      totalAdvances,
      activeCount,
      totalCount: customersStore.length,
    },
  };
}

/**
 * Check if a customer name or GSTIN already exists
 */
export function checkDuplicate(name: string, gstin?: string): {
  isDuplicate: boolean;
  reason?: string;
} {
  const trimmedName = name.trim().toLowerCase();
  const nameExists = customersStore.some(
    (c) => c.name.trim().toLowerCase() === trimmedName
  );

  if (nameExists) {
    return {
      isDuplicate: true,
      reason: `A customer named "${name.trim()}" already exists in your organization.`,
    };
  }

  if (gstin && gstin.trim()) {
    const cleanGstin = gstin.trim().toUpperCase();
    const gstinExists = customersStore.find(
      (c) => c.gstin && c.gstin.toUpperCase() === cleanGstin
    );
    if (gstinExists) {
      return {
        isDuplicate: true,
        reason: `A customer with GSTIN ${cleanGstin} already exists (${gstinExists.name}).`,
      };
    }
  }

  return { isDuplicate: false };
}

/**
 * Create a new customer in the store
 */
export async function createCustomer(
  input: CustomerFormValues,
  isDraft: boolean = false
): Promise<Customer> {
  // Simulate 400ms network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const duplicateCheck = checkDuplicate(input.name, input.gstin);
  if (duplicateCheck.isDuplicate && !isDraft) {
    // We flag warning or allow with warning, but for strict test:
    console.warn("Duplicate detected:", duplicateCheck.reason);
  }

  const newCustomer: Customer = {
    id: `c-${Math.random().toString(36).slice(2, 9)}`,
    name: input.name.trim(),
    type: input.type,
    contactPerson: input.contactPerson.trim(),
    email: input.email.trim().toLowerCase(),
    mobile: input.mobile.trim(),
    gstRegistrationType: input.gstRegistrationType,
    gstin: input.gstin ? input.gstin.trim().toUpperCase() : undefined,
    placeOfSupply: input.placeOfSupply,
    paymentTerms: input.paymentTerms,
    creditLimit: input.creditLimit || undefined,
    openingBalance: input.openingBalance || 0,
    receivables: input.openingBalance || 0,
    advanceBalance: 0,
    status: isDraft ? "inactive" : "active",
    billingAddress: input.billingAddress.trim(),
    shippingAddress: input.sameAsBilling
      ? input.billingAddress.trim()
      : input.shippingAddress.trim(),
    notes: input.notes?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  // Prepend to store so newly created customers appear at the top
  customersStore = [newCustomer, ...customersStore];

  return newCustomer;
}

/**
 * Toggle customer active/inactive status
 */
export async function toggleCustomerStatus(id: string): Promise<Customer> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const customer = customersStore.find((c) => c.id === id);
  if (!customer) {
    throw new Error("Customer not found");
  }
  customer.status = customer.status === "active" ? "inactive" : "active";
  return customer;
}
