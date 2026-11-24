"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  AlertTriangle,
  Info,
  Save,
  FileEdit,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { collapseExpandVariants } from "@/lib/motion";
import { customerSchema, CustomerFormValues } from "@/features/customers/schema";
import {
  CUSTOMER_TYPES,
  GST_REGISTRATION_TYPES,
  PAYMENT_TERMS,
  INDIAN_STATES,
} from "@/features/customers/constants";
import { createCustomer, checkDuplicate } from "@/features/customers/api";

export default function CreateCustomerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema) as any,
    defaultValues: {
      name: "",
      type: "business",
      contactPerson: "",
      email: "",
      mobile: "",
      billingAddress: "",
      shippingAddress: "",
      sameAsBilling: false,
      gstRegistrationType: "Registered",
      gstin: "",
      placeOfSupply: "Karnataka",
      paymentTerms: "Net 30",
      creditLimit: undefined,
      openingBalance: undefined,
      notes: "",
    },
  });

  const watchedName = watch("name");
  const watchedGstin = watch("gstin");
  const watchedGstType = watch("gstRegistrationType");
  const watchedSameAsBilling = watch("sameAsBilling");
  const watchedBillingAddress = watch("billingAddress");
  const watchedCreditLimit = watch("creditLimit");

  const isGstRequired = ["Registered", "Composition", "SEZ"].includes(
    watchedGstType
  );

  // Sync shipping address when sameAsBilling is checked
  useEffect(() => {
    if (watchedSameAsBilling) {
      setValue("shippingAddress", watchedBillingAddress, { shouldValidate: true });
    }
  }, [watchedSameAsBilling, watchedBillingAddress, setValue]);

  // Live duplicate checking for customer name or GSTIN
  useEffect(() => {
    if ((watchedName && watchedName.length >= 3) || (watchedGstin && watchedGstin.length >= 10)) {
      const check = checkDuplicate(watchedName || "", watchedGstin || "");
      if (check.isDuplicate && check.reason) {
        setDuplicateWarning(check.reason);
      } else {
        setDuplicateWarning(null);
      }
    } else {
      setDuplicateWarning(null);
    }
  }, [watchedName, watchedGstin]);

  const onSubmit = async (values: CustomerFormValues) => {
    setIsSubmitting(true);
    try {
      const created = await createCustomer(values, false);
      toast.success(`Customer "${created.name}" created successfully.`);
      router.push("/customers");
    } catch (err: any) {
      toast.error(err.message || "Failed to create customer.");
      setIsSubmitting(false);
    }
  };

  const onSaveDraft = async () => {
    const values = watch();
    if (!values.name || values.name.trim().length === 0) {
      toast.error("Please enter a customer name to save as draft.");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createCustomer(values as CustomerFormValues, true);
      toast.success(`Customer "${created.name}" saved as Draft.`);
      router.push("/customers");
    } catch {
      toast.error("Failed to save draft.");
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setShowCancelDialog(true);
    } else {
      router.push("/customers");
    }
  };

  return (
    <div className="max-w-5xl space-y-4 pb-12">
      {/* Zoho-style Responsive Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            href="/customers"
            onClick={(e) => {
              if (isDirty) {
                e.preventDefault();
                setShowCancelDialog(true);
              }
            }}
            className="flex items-center justify-center size-7 rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0"
            aria-label="Back to customers"
          >
            <ArrowLeft className="size-3.5" />
          </Link>
          <h1 className="text-[18px] font-semibold text-foreground leading-tight truncate">
            New Customer
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancelClick}
            className="h-8 text-[12px] rounded"
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            className="h-8 text-[12px] gap-1.5 rounded"
            type="button"
          >
            <FileEdit className="size-3.5 text-muted-foreground" />
            <span>Save as Draft</span>
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting}
            className="h-8 text-[12px] gap-1.5 bg-primary text-primary-foreground font-medium hover:bg-primary/90 rounded px-3"
            type="button"
          >
            <Save className="size-3.5" />
            <span>Save</span>
          </Button>
        </div>
      </div>

      {/* Duplicate Warning Alert */}
      {duplicateWarning && (
        <div className="flex items-start gap-2.5 rounded border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-[12px] text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <span className="font-semibold">Potential Duplicate: </span>
            <span>{duplicateWarning}</span>
          </div>
        </div>
      )}

      {/* Flat Form Pad Surface */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded border border-border bg-card p-5 md:p-6 space-y-6"
      >
        {/* 1. BASIC DETAILS */}
        <section className="space-y-4">
          <h2 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Basic Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[12px] font-medium text-[#3c4043] dark:text-foreground">
                Display Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Sri Lakshmi Traders"
                {...register("name")}
                className={`h-9 rounded text-[13px] ${errors.name ? "border-destructive" : ""}`}
              />
              {errors.name && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="type" className="text-[12px] font-medium text-[#3c4043] dark:text-foreground">
                Customer Type <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => {
                  const selectedLabel =
                    CUSTOMER_TYPES.find((t) => t.value === field.value)?.label ?? "Select type";
                  return (
                    <Select value={field.value} onValueChange={(val) => field.onChange(val || "business")}>
                      <SelectTrigger id="type" className="h-9 rounded text-[13px]">
                        <SelectValue placeholder="Select type">{selectedLabel}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {CUSTOMER_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="text-[13px]">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.type && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.type.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 2. CONTACT INFORMATION */}
        <section className="space-y-4">
          <h2 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="contactPerson" className="text-[12px] font-medium text-[#3c4043] dark:text-foreground">
                Primary Contact <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contactPerson"
                placeholder="e.g. Ramesh Kumar"
                {...register("contactPerson")}
                className={`h-9 rounded text-[13px] ${errors.contactPerson ? "border-destructive" : ""}`}
              />
              {errors.contactPerson && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.contactPerson.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[12px] font-medium text-[#3c4043] dark:text-foreground">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="accounts@example.in"
                {...register("email")}
                className={`h-9 rounded text-[13px] ${errors.email ? "border-destructive" : ""}`}
              />
              {errors.email && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mobile" className="text-[12px] font-medium text-[#3c4043] dark:text-foreground">
                Mobile Number <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] font-mono text-muted-foreground">
                  +91
                </span>
                <Input
                  id="mobile"
                  placeholder="9876543210"
                  {...register("mobile")}
                  className={`h-9 rounded pl-10 font-mono text-[13px] ${errors.mobile ? "border-destructive" : ""}`}
                />
              </div>
              {errors.mobile && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.mobile.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 3. GST & TAX DETAILS */}
        <section className="space-y-4">
          <h2 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Tax Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="gstRegistrationType" className="text-[12px] font-medium text-[#3c4043] dark:text-foreground">
                GST Treatment <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="gstRegistrationType"
                control={control}
                render={({ field }) => {
                  const selectedLabel =
                    GST_REGISTRATION_TYPES.find((g) => g.value === field.value)?.label ??
                    "Select GST registration";
                  return (
                    <Select value={field.value} onValueChange={(val) => field.onChange(val || "Registered")}>
                      <SelectTrigger id="gstRegistrationType" className="h-9 rounded text-[13px]">
                        <SelectValue placeholder="Select GST registration">{selectedLabel}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {GST_REGISTRATION_TYPES.map((gst) => (
                          <SelectItem key={gst.value} value={gst.value} className="text-[13px]">
                            {gst.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.gstRegistrationType && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.gstRegistrationType.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="placeOfSupply" className="text-[12px] font-medium text-[#3c4043] dark:text-foreground">
                Place of Supply <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="placeOfSupply"
                control={control}
                render={({ field }) => {
                  const matchedState = INDIAN_STATES.find((s) => s.name === field.value);
                  const selectedLabel = matchedState
                    ? `${matchedState.code} - ${matchedState.name}`
                    : "Select State";
                  return (
                    <Select value={field.value} onValueChange={(val) => field.onChange(val || "Karnataka")}>
                      <SelectTrigger id="placeOfSupply" className="h-9 rounded text-[13px]">
                        <SelectValue placeholder="Select State">{selectedLabel}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {INDIAN_STATES.map((state) => (
                          <SelectItem key={state.code} value={state.name} className="text-[13px]">
                            {state.code} - {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.placeOfSupply && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.placeOfSupply.message}
                </p>
              )}
            </div>
          </div>

          <AnimatePresence>
            {isGstRequired && (
              <motion.div
                key="gstin-field"
                variants={collapseExpandVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="gstin" className="text-[12px] font-medium text-[#3c4043] dark:text-foreground">
                    GSTIN (15 characters) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="gstin"
                    placeholder="29ABCDE1234F1Z5"
                    maxLength={15}
                    {...register("gstin", {
                      onChange: (e) => {
                        e.target.value = e.target.value.toUpperCase();
                      },
                    })}
                    className={`h-9 rounded font-mono uppercase tracking-wider text-[13px] ${
                      errors.gstin ? "border-destructive" : ""
                    }`}
                  />
                  {errors.gstin ? (
                    <p className="text-[11px] text-destructive font-medium">
                      {errors.gstin.message}
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      Format: 2-digit state code + 10-digit PAN + entity + check character + Z + checksum.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 4. ADDRESS INFORMATION */}
        <section className="space-y-4">
          <h2 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Address Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="billingAddress" className="text-[12px] font-medium text-[#3c4043] dark:text-foreground">
                Billing Address <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="billingAddress"
                rows={3}
                placeholder="Building / Flat, Street, City, State, PIN Code"
                {...register("billingAddress")}
                className={`rounded text-[13px] ${errors.billingAddress ? "border-destructive" : ""}`}
              />
              {errors.billingAddress && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.billingAddress.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="shippingAddress" className="text-[12px] font-medium text-[#3c4043] dark:text-foreground">
                  Shipping Address {!watchedSameAsBilling && <span className="text-destructive">*</span>}
                </Label>
                <div className="flex items-center gap-1.5">
                  <Controller
                    name="sameAsBilling"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="sameAsBilling"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label
                    htmlFor="sameAsBilling"
                    className="text-[11px] cursor-pointer font-normal text-muted-foreground"
                  >
                    Copy billing address
                  </Label>
                </div>
              </div>
              <Textarea
                id="shippingAddress"
                rows={3}
                disabled={watchedSameAsBilling}
                placeholder="Delivery address, Warehouse / Facility, PIN Code"
                {...register("shippingAddress")}
                className={`rounded text-[13px] ${errors.shippingAddress ? "border-destructive" : ""}`}
              />
              {errors.shippingAddress && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.shippingAddress.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 5. PAYMENT DEFAULTS & OPENING BALANCE */}
        <section className="space-y-4">
          <h2 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Payment Defaults &amp; Opening Balance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="paymentTerms" className="text-[12px] font-medium text-[#3c4043] dark:text-foreground">
                Payment Terms <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="paymentTerms"
                control={control}
                render={({ field }) => {
                  const selectedLabel =
                    PAYMENT_TERMS.find((t) => t.value === field.value)?.label ?? "Select terms";
                  return (
                    <Select value={field.value} onValueChange={(val) => field.onChange(val || "Net 30")}>
                      <SelectTrigger id="paymentTerms" className="h-9 rounded text-[13px]">
                        <SelectValue placeholder="Select terms">{selectedLabel}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_TERMS.map((term) => (
                          <SelectItem key={term.value} value={term.value} className="text-[13px]">
                            {term.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.paymentTerms && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.paymentTerms.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="creditLimit" className="text-[12px] font-medium text-[#3c4043] dark:text-foreground">
                Credit Limit (INR)
              </Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] font-medium text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="creditLimit"
                  type="number"
                  step="1000"
                  placeholder="0.00"
                  {...register("creditLimit", { valueAsNumber: true })}
                  className="h-9 rounded pl-7 tabular-nums text-[13px]"
                />
              </div>
              {watchedCreditLimit && watchedCreditLimit > 0 ? (
                <p className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <Info className="size-3 shrink-0" />
                  Warnings shown on invoice confirmation.
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  Blank or 0 for unlimited credit.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="openingBalance" className="text-[12px] font-medium text-[#3c4043] dark:text-foreground">
                Opening Balance (INR)
              </Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] font-medium text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="openingBalance"
                  type="number"
                  step="100"
                  placeholder="0.00"
                  {...register("openingBalance", { valueAsNumber: true })}
                  className="h-9 rounded pl-7 tabular-nums text-[13px]"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Positive indicates receivables owed.
              </p>
            </div>
          </div>
        </section>

        {/* 6. ADDITIONAL INFORMATION */}
        <section className="space-y-4">
          <h2 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Remarks / Notes
          </h2>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-[12px] font-medium text-[#3c4043] dark:text-foreground">
              Internal Notes
            </Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="Special delivery instructions, preferred transport carriers, or contract references..."
              {...register("notes")}
              className="rounded text-[13px]"
            />
            {errors.notes && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.notes.message}
              </p>
            )}
          </div>
        </section>

        {/* Bottom Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancelClick}
            className="h-8 text-[12px] rounded w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            className="h-8 text-[12px] gap-1.5 rounded w-full sm:w-auto"
          >
            <FileEdit className="size-3.5 text-muted-foreground" />
            <span>Save as Draft</span>
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            className="h-8 text-[12px] gap-1.5 bg-primary text-primary-foreground font-medium hover:bg-primary/90 rounded px-4 w-full sm:w-auto"
          >
            <Save className="size-3.5" />
            <span>Save</span>
          </Button>
        </div>
      </form>

      {/* Confirmation Dialog on Cancel with Unsaved Changes */}
      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Discard Unsaved Changes?"
        description="You have unsaved information in this form. If you leave now, all your changes will be discarded."
        confirmText="Discard and Leave"
        cancelText="Keep Editing"
        variant="destructive"
        onConfirm={() => router.push("/customers")}
      />
    </div>
  );
}
