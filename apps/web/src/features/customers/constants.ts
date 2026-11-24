export const CUSTOMER_TYPES = [
  { value: "business", label: "Business" },
  { value: "individual", label: "Individual" },
] as const;

export const GST_REGISTRATION_TYPES = [
  { value: "Registered", label: "Registered Business (Regular)" },
  { value: "Unregistered", label: "Unregistered Business / Individual" },
  { value: "Composition", label: "Composition Scheme" },
  { value: "SEZ", label: "Special Economic Zone (SEZ)" },
  { value: "Overseas", label: "Overseas / Export" },
  { value: "Consumer", label: "Consumer (B2C)" },
] as const;

export const PAYMENT_TERMS = [
  { value: "Due on Receipt", label: "Due on Receipt" },
  { value: "Net 15", label: "Net 15 (15 days)" },
  { value: "Net 30", label: "Net 30 (30 days)" },
  { value: "Net 45", label: "Net 45 (45 days)" },
  { value: "Net 60", label: "Net 60 (60 days)" },
] as const;

export const INDIAN_STATES = [
  { code: "29", name: "Karnataka" },
  { code: "27", name: "Maharashtra" },
  { code: "33", name: "Tamil Nadu" },
  { code: "07", name: "Delhi" },
  { code: "24", name: "Gujarat" },
  { code: "36", name: "Telangana" },
  { code: "37", name: "Andhra Pradesh" },
  { code: "09", name: "Uttar Pradesh" },
  { code: "19", name: "West Bengal" },
  { code: "32", name: "Kerala" },
  { code: "08", name: "Rajasthan" },
  { code: "03", name: "Punjab" },
  { code: "06", name: "Haryana" },
  { code: "23", name: "Madhya Pradesh" },
  { code: "10", name: "Bihar" },
  { code: "21", name: "Odisha" },
  { code: "20", name: "Jharkhand" },
  { code: "22", name: "Chhattisgarh" },
  { code: "05", name: "Uttarakhand" },
  { code: "02", name: "Himachal Pradesh" },
  { code: "30", name: "Goa" },
  { code: "18", name: "Assam" },
  { code: "01", name: "Jammu and Kashmir" },
  { code: "31", name: "Lakshadweep" },
  { code: "34", name: "Puducherry" },
  { code: "35", name: "Andaman and Nicobar Islands" },
  { code: "04", name: "Chandigarh" },
  { code: "38", name: "Ladakh" },
] as const;
