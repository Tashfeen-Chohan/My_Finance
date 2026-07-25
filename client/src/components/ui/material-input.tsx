"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MaterialInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
  variant?: "outlined" | "filled";
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const MaterialInput = React.forwardRef<HTMLInputElement, MaterialInputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      variant = "outlined",
      leadingIcon,
      trailingIcon,
      value,
      defaultValue,
      onFocus,
      onBlur,
      onChange,
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value ?? defaultValue ?? "");
    const generatedId = React.useId();
    const inputId = id || generatedId;

    React.useEffect(() => {
      if (value !== undefined) {
        setInputValue(value);
      }
    }, [value]);

    const isFloating = isFocused || String(inputValue).length > 0;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      onChange?.(e);
    };

    return (
      <div className="w-full space-y-1">
        <div
          className={cn(
            "group relative flex min-h-[52px] cursor-text items-center rounded-lg transition-all duration-200",
            variant === "outlined" &&
              "border-input bg-background focus-within:border-primary focus-within:ring-primary/20 border focus-within:ring-2",
            variant === "filled" &&
              "bg-muted/60 border-muted-foreground/40 focus-within:border-primary focus-within:bg-muted/90 rounded-t-lg rounded-b-none border-b-2",
            error &&
              "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
            className
          )}
        >
          {leadingIcon && (
            <div className="text-muted-foreground flex shrink-0 items-center pr-1 pl-3">
              {leadingIcon}
            </div>
          )}

          <div className="relative flex h-full flex-1 items-center px-3">
            <input
              id={inputId}
              ref={ref}
              value={value}
              defaultValue={defaultValue}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              className={cn(
                "text-foreground h-full min-h-[48px] w-full bg-transparent pt-4 pb-1 text-sm font-medium placeholder-transparent outline-none disabled:cursor-not-allowed disabled:opacity-50",
                leadingIcon ? "pl-0" : "",
                trailingIcon ? "pr-0" : ""
              )}
              placeholder={label}
              {...props}
            />

            <label
              htmlFor={inputId}
              className={cn(
                "text-muted-foreground pointer-events-none absolute left-3 origin-left font-medium transition-all duration-200 ease-out select-none",
                leadingIcon ? "left-0" : "left-3",
                isFloating
                  ? "top-1.5 text-[10px] tracking-wider uppercase"
                  : "top-1/2 -translate-y-1/2 text-sm",
                isFocused && !error && "text-primary",
                error && "text-destructive"
              )}
            >
              {label}
            </label>
          </div>

          {trailingIcon && (
            <div className="text-muted-foreground flex shrink-0 items-center pr-3 pl-1">
              {trailingIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={cn(
              "px-1 text-xs font-medium transition-colors",
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
