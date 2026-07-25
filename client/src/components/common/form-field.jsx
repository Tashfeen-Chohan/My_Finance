"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

export function FormField({
  form,
  name,
  label,
  type = "text",
  placeholder,
  description,
}) {
  const {
    register,
    formState: { errors },
  } = form;

  const error = errors[name]?.message;

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
