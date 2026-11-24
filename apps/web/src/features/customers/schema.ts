import { z } from "zod";
import { GSTIN_REGEX } from "@/lib/formatters";

export const customerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Customer name must be at least 2 characters")
      .max(120, "Customer name cannot exceed 120 characters")
      .trim(),
    type: z.enum(["business", "individual"], {
      error: "Please select customer type",
    }),
    contactPerson: z
      .string()
      .min(2, "Contact person name is required")
      .max(100, "Contact person name cannot exceed 100 characters")
      .trim(),
    email: z
      .string()
      .email("Please enter a valid email address")
      .trim()
      .toLowerCase(),
    mobile: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number")
      .trim(),
    billingAddress: z
      .string()
      .min(5, "Billing address must be at least 5 characters")
      .max(500, "Address is too long")
      .trim(),
    shippingAddress: z
      .string()
      .min(5, "Shipping address must be at least 5 characters")
      .max(500, "Address is too long")
      .trim(),
    sameAsBilling: z.boolean().default(false),
    gstRegistrationType: z
      .string()
      .min(1, "Please select GST registration type"),
    gstin: z.string().trim().optional(),
    placeOfSupply: z
      .string()
      .min(1, "Please select place of supply (State)"),
    paymentTerms: z
      .string()
      .min(1, "Please select payment terms"),
    creditLimit: z
      .union([z.number().min(0, "Credit limit must be a positive number"), z.nan()])
      .optional(),
    openingBalance: z
      .union([z.number(), z.nan()])
      .optional(),
    notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
  })
  .superRefine((data, ctx) => {
    const isGstRequired = ["Registered", "Composition", "SEZ"].includes(
      data.gstRegistrationType
    );

    if (isGstRequired) {
      if (!data.gstin || data.gstin.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "GSTIN is mandatory for registered businesses",
          path: ["gstin"],
        });
      } else if (!GSTIN_REGEX.test(data.gstin.trim().toUpperCase())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Invalid GSTIN format (15 characters: e.g. 29ABCDE1234F1Z5)",
          path: ["gstin"],
        });
      }
    }
  });

export type CustomerFormValues = z.infer<typeof customerSchema>;
