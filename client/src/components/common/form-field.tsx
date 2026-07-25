"use client";

import * as React from "react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface FormFieldProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  type?: string;
  placeholder?: string;
  description?: string;
}

export function FormField<TFieldValues extends FieldValues>({
  form,
  name,
  label,
  type = "text",
  placeholder,
  description,
}: FormFieldProps<TFieldValues>) {
  const {
    register,
    formState: { errors },
  } = form;

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-foreground text-sm font-medium">
        {label}
      </label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={error ? "border-destructive focus-visible:ring-destructive" : ""}
      />
      {description && !error && <p className="text-muted-foreground text-xs">{description}</p>}
      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
    </div>
  );
}
