export type CustomerStatus = "active" | "inactive";
export type CustomerType = "business" | "individual";

export type GstRegistrationType =
  | "Registered"
  | "Unregistered"
  | "Composition"
  | "SEZ"
  | "Overseas"
  | "Consumer";

export interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  contactPerson: string;
  email: string;
  mobile: string;
  gstRegistrationType: GstRegistrationType | string;
  gstin?: string;
  placeOfSupply: string;
  paymentTerms: string;
  creditLimit?: number;
  openingBalance?: number;
  receivables: number;      // display only, calculated by backend in real life
  advanceBalance: number;   // display only
  status: CustomerStatus;
  billingAddress: string;
  shippingAddress: string;
  notes?: string;
  createdAt?: string;
}
