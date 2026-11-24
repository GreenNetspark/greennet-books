"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  Building,
  User,
  MapPin,
  FileText,
  CreditCard,
  Banknote,
  AlertTriangle,
  Info,
  Save,
  FileEdit,
} from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  // Handle Form Submission
  const onSubmit = async (values: CustomerFormValues) => {
    setIsSubmitting(true);
    try {
      const created = await createCustomer(values, false);
      toast.success(`Customer "${created.name}" created successfully!`);
      router.push("/customers");
    } catch (err: any) {
      toast.error(err.message || "Failed to create customer.");
      setIsSubmitting(false);
    }
  };

  // Handle Save as Draft
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
    } catch (err: any) {
      toast.error("Failed to save draft.");
      setIsSubmitting(false);
    }
  };

  // Handle Cancel
  const handleCancelClick = () => {
    if (isDirty) {
      setShowCancelDialog(true);
    } else {
      router.push("/customers");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Page Header */}
      <PageHeader
        title="Create Customer"
        description="Add a new customer account to your organization ledger with statutory GST information."
        breadcrumbs={[
          { label: "Sales", href: "/customers" },
          { label: "Customers", href: "/customers" },
          { label: "Create Customer" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelClick}
              className="text-xs"
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveDraft}
              disabled={isSubmitting}
              className="text-xs gap-1.5"
              type="button"
            >
              <FileEdit className="size-3.5 text-muted-foreground" />
              <span>Save as Draft</span>
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit(onSubmit)}
              loading={isSubmitting}
              className="text-xs gap-1.5 bg-primary text-primary-foreground font-medium shadow-xs hover:bg-primary/90"
              type="button"
            >
              <Save className="size-3.5" />
              <span>Save Customer</span>
            </Button>
          </div>
        }
      />

      {/* Duplicate Warning Alert */}
      {duplicateWarning && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300 shadow-xs">
          <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-sm">Potential Duplicate Customer</p>
            <p>{duplicateWarning}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Basic Information */}
        <Card className="shadow-xs">
          <CardHeader className="pb-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <Building className="size-4" />
                </div>
                <span>1. Basic Information</span>
              </CardTitle>
              <span className="text-[11px] font-medium text-muted-foreground">Step 1 of 7</span>
            </div>
            <CardDescription className="text-xs mt-1">
              Primary business identity and legal entity categorization.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold">
                  Customer Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Sri Lakshmi Traders"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-[11px] text-destructive font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Customer Type */}
              <div className="space-y-1.5">
                <Label htmlFor="type" className="text-xs font-semibold">
                  Customer Type <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(val) => field.onChange(val || "business")}>
                      <SelectTrigger id="type" className="h-9 text-xs">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CUSTOMER_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className="text-[11px] text-destructive font-medium">
                    {errors.type.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Contact Information */}
        <Card className="shadow-xs">
          <CardHeader className="pb-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <User className="size-4" />
                </div>
                <span>2. Contact Information</span>
              </CardTitle>
              <span className="text-[11px] font-medium text-muted-foreground">Step 2 of 7</span>
            </div>
            <CardDescription className="text-xs mt-1">
              Key personnel for billing communications, invoice notifications, and statements.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Contact Person */}
              <div className="space-y-1.5">
                <Label htmlFor="contactPerson" className="text-xs font-semibold">
                  Contact Person <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactPerson"
                  placeholder="e.g. Ramesh Kumar"
                  {...register("contactPerson")}
                  className={errors.contactPerson ? "border-destructive" : ""}
                />
                {errors.contactPerson && (
                  <p className="text-[11px] text-destructive font-medium">
                    {errors.contactPerson.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="accounts@example.in"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-[11px] text-destructive font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <Label htmlFor="mobile" className="text-xs font-semibold">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
                    +91
                  </span>
                  <Input
                    id="mobile"
                    placeholder="9876543210"
                    {...register("mobile")}
                    className={`pl-10 font-mono ${errors.mobile ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.mobile && (
                  <p className="text-[11px] text-destructive font-medium">
                    {errors.mobile.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Address Information */}
        <Card className="shadow-xs">
          <CardHeader className="pb-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <MapPin className="size-4" />
                </div>
                <span>3. Address Information</span>
              </CardTitle>
              <span className="text-[11px] font-medium text-muted-foreground">Step 3 of 7</span>
            </div>
            <CardDescription className="text-xs mt-1">
              Physical locations for tax determination (place of supply) and goods delivery.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Billing Address */}
            <div className="space-y-1.5">
              <Label htmlFor="billingAddress" className="text-xs font-semibold">
                Billing Address <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="billingAddress"
                rows={3}
                placeholder="Building / Flat, Street, City, State, PIN Code"
                {...register("billingAddress")}
                className={errors.billingAddress ? "border-destructive" : ""}
              />
              {errors.billingAddress && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.billingAddress.message}
                </p>
              )}
            </div>

            {/* Same as Billing Checkbox */}
            <div className="flex items-center gap-2 pt-1 pb-1">
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
                className="text-xs cursor-pointer font-normal text-foreground"
              >
                Shipping address is identical to billing address
              </Label>
            </div>

            {/* Shipping Address */}
            {!watchedSameAsBilling && (
              <div className="space-y-1.5">
                <Label htmlFor="shippingAddress" className="text-xs font-semibold">
                  Shipping Address <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="shippingAddress"
                  rows={3}
                  placeholder="Delivery address, Warehouse / Facility, PIN Code"
                  {...register("shippingAddress")}
                  className={errors.shippingAddress ? "border-destructive" : ""}
                />
                {errors.shippingAddress && (
                  <p className="text-[11px] text-destructive font-medium">
                    {errors.shippingAddress.message}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 4: GST Information */}
        <Card className="shadow-xs">
          <CardHeader className="pb-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="size-4" />
                </div>
                <span>4. GST and Tax Details</span>
              </CardTitle>
              <span className="text-[11px] font-medium text-muted-foreground">Step 4 of 7</span>
            </div>
            <CardDescription className="text-xs mt-1">
              Statutory tax identifiers and state of supply for CGST / SGST / IGST calculation.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* GST Registration Type */}
              <div className="space-y-1.5">
                <Label htmlFor="gstRegistrationType" className="text-xs font-semibold">
                  GST Registration Type <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="gstRegistrationType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(val) => field.onChange(val || "Registered")}>
                      <SelectTrigger id="gstRegistrationType" className="h-9 text-xs">
                        <SelectValue placeholder="Select GST registration" />
                      </SelectTrigger>
                      <SelectContent>
                        {GST_REGISTRATION_TYPES.map((gst) => (
                          <SelectItem key={gst.value} value={gst.value}>
                            {gst.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gstRegistrationType && (
                  <p className="text-[11px] text-destructive font-medium">
                    {errors.gstRegistrationType.message}
                  </p>
                )}
              </div>

              {/* Place of Supply */}
              <div className="space-y-1.5">
                <Label htmlFor="placeOfSupply" className="text-xs font-semibold">
                  Place of Supply (State) <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="placeOfSupply"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(val) => field.onChange(val || "Karnataka")}>
                      <SelectTrigger id="placeOfSupply" className="h-9 text-xs">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {INDIAN_STATES.map((state) => (
                          <SelectItem key={state.code} value={state.name}>
                            {state.code} - {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.placeOfSupply && (
                  <p className="text-[11px] text-destructive font-medium">
                    {errors.placeOfSupply.message}
                  </p>
                )}
              </div>
            </div>

            {/* Conditional GSTIN Field with Motion AnimatePresence */}
            <AnimatePresence>
              {isGstRequired && (
                <motion.div
                  key="gstin-field"
                  variants={collapseExpandVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-1.5 pt-2"
                >
                  <Label htmlFor="gstin" className="text-xs font-semibold">
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
                    className={`font-mono uppercase tracking-wider text-xs sm:text-sm ${
                      errors.gstin ? "border-destructive" : ""
                    }`}
                  />
                  {errors.gstin ? (
                    <p className="text-[11px] text-destructive font-medium">
                      {errors.gstin.message}
                    </p>
                  ) : (
                    <p className="text-[10px] text-muted-foreground">
                      Format: 2-digit state code + 10-digit PAN + 1-digit entity + 1 check character + Z + 1 check sum.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Section 5: Payment Terms */}
        <Card className="shadow-xs">
          <CardHeader className="pb-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <CreditCard className="size-4" />
                </div>
                <span>5. Payment Terms and Credit Policy</span>
              </CardTitle>
              <span className="text-[11px] font-medium text-muted-foreground">Step 5 of 7</span>
            </div>
            <CardDescription className="text-xs mt-1">
              Standard invoice due dates and credit limit safeguards.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Payment Terms */}
              <div className="space-y-1.5">
                <Label htmlFor="paymentTerms" className="text-xs font-semibold">
                  Payment Terms <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="paymentTerms"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(val) => field.onChange(val || "Net 30")}>
                      <SelectTrigger id="paymentTerms" className="h-9 text-xs">
                        <SelectValue placeholder="Select terms" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_TERMS.map((term) => (
                          <SelectItem key={term.value} value={term.value}>
                            {term.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.paymentTerms && (
                  <p className="text-[11px] text-destructive font-medium">
                    {errors.paymentTerms.message}
                  </p>
                )}
              </div>

              {/* Credit Limit */}
              <div className="space-y-1.5">
                <Label htmlFor="creditLimit" className="text-xs font-semibold">
                  Credit Limit (INR) <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="creditLimit"
                    type="number"
                    step="1000"
                    placeholder="0.00"
                    {...register("creditLimit", { valueAsNumber: true })}
                    className="pl-7 tabular-nums"
                  />
                </div>
                {watchedCreditLimit && watchedCreditLimit > 0 ? (
                  <p className="text-[10px] text-amber-700 dark:text-amber-400 flex items-center gap-1 font-medium">
                    <Info className="size-3" />
                    Credit limit warnings will be shown during sales invoice confirmation.
                  </p>
                ) : (
                  <p className="text-[10px] text-muted-foreground">
                    Leave blank or 0 for unlimited credit.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Opening Balance */}
        <Card className="shadow-xs">
          <CardHeader className="pb-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <Banknote className="size-4" />
                </div>
                <span>6. Opening Balance</span>
              </CardTitle>
              <span className="text-[11px] font-medium text-muted-foreground">Step 6 of 7</span>
            </div>
            <CardDescription className="text-xs mt-1">
              Historical ledger balance brought forward as of fiscal year start.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="max-w-md space-y-1.5">
              <Label htmlFor="openingBalance" className="text-xs font-semibold">
                Opening Balance (INR) <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="openingBalance"
                  type="number"
                  step="100"
                  placeholder="0.00"
                  {...register("openingBalance", { valueAsNumber: true })}
                  className="pl-7 tabular-nums"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Positive balance indicates receivables owed by customer.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 7: Additional Information */}
        <Card className="shadow-xs">
          <CardHeader className="pb-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <FileEdit className="size-4" />
                </div>
                <span>7. Additional Information</span>
              </CardTitle>
              <span className="text-[11px] font-medium text-muted-foreground">Step 7 of 7</span>
            </div>
            <CardDescription className="text-xs mt-1">
              Internal notes, delivery instructions, and relationship memos.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs font-semibold">
                Customer Notes <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Special delivery instructions, preferred transport carriers, or contract references..."
                {...register("notes")}
              />
              {errors.notes && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.notes.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Form Actions Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancelClick}
            className="w-full sm:w-auto text-xs"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onSaveDraft}
              disabled={isSubmitting}
              className="w-full sm:w-auto text-xs gap-1.5"
            >
              <FileEdit className="size-3.5 text-muted-foreground" />
              <span>Save as Draft</span>
            </Button>

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full sm:w-auto text-xs gap-1.5 bg-primary text-primary-foreground font-medium shadow-xs hover:bg-primary/90"
            >
              <Save className="size-3.5" />
              <span>Save Customer</span>
            </Button>
          </div>
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
