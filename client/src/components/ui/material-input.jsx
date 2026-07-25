"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const MaterialInput = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      leadingIcon,
      trailingIcon,
      variant = "outlined",
      className,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(defaultValue || "");

    const inputId = id || React.useId();
    const inputValue = value !== undefined ? value : internalValue;

    const handleChange = (e) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const isFloating = isFocused || String(inputValue).length > 0;

    const handleFocus = (e) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className="relative w-full">
        <div
          className={cn(
            "relative flex items-center transition-all duration-200",
            variant === "outlined" && [
              "border-input rounded-xl border bg-transparent shadow-xs transition-colors",
              isFocused && "border-primary ring-primary/20 ring-2",
              error && "border-destructive ring-destructive/20 ring-2",
            ],
            variant === "filled" && [
              "bg-muted/60 hover:bg-muted focus-within:bg-muted border-b-2 border-transparent rounded-t-xl transition-colors",
              isFocused && "border-primary bg-muted",
              error && "border-destructive bg-destructive/10",
            ],
            className
          )}
        >
          {leadingIcon && (
            <div className="text-muted-foreground pointer-events-none pl-3.5 pr-1.5">
              {leadingIcon}
            </div>
          )}

          <div className="relative flex-1">
            <input
              ref={ref}
              id={inputId}
              value={inputValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={cn(
                "text-foreground placeholder:text-muted-foreground/60 flex h-14 w-full bg-transparent px-3.5 pt-4 pb-1 text-sm font-medium focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                !label && "pt-1 pb-1",
                leadingIcon && "pl-1"
              )}
              {...props}
            />

            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  "text-muted-foreground pointer-events-none absolute left-3.5 origin-left transition-all duration-200 select-none",
                  leadingIcon && "left-1",
                  isFloating
                    ? "top-2 scale-75 text-xs font-semibold text-primary"
                    : "top-4 scale-100 text-sm font-normal",
                  error && isFloating && "text-destructive"
                )}
              >
                {label}
              </label>
            )}
          </div>

          {trailingIcon && <div className="pr-3.5 pl-1.5">{trailingIcon}</div>}
        </div>

        {(error || helperText) && (
          <p
            className={cn(
              "mt-1.5 px-1 text-xs font-medium transition-colors",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
MaterialInput.displayName = "MaterialInput";

export { MaterialInput };
