import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ============================================
   Input
   ============================================ */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-white mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full h-11 px-4 rounded-lg border bg-charcoal text-white placeholder:text-silver-gray",
            "border-silver/50 focus:border-gold focus:ring-1 focus:ring-gold/30",
            "transition-colors duration-200",
            error && "border-error focus:border-error focus:ring-error/30",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-silver-gray">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

/* ============================================
   Textarea
   ============================================ */

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-white mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full min-h-[120px] px-4 py-3 rounded-lg border bg-charcoal text-white placeholder:text-silver-gray",
            "border-silver/50 focus:border-gold focus:ring-1 focus:ring-gold/30",
            "transition-colors duration-200 resize-y",
            error && "border-error focus:border-error focus:ring-error/30",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-silver-gray">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

/* ============================================
   Select
   ============================================ */

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, options, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-white mb-2"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            "w-full h-11 px-4 rounded-lg border bg-charcoal text-white",
            "border-silver/50 focus:border-gold focus:ring-1 focus:ring-gold/30",
            "transition-colors duration-200 appearance-none",
            "bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23C0C0C0%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10",
            error && "border-error focus:border-error focus:ring-error/30",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-silver-gray">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

/* ============================================
   Checkbox
   ============================================ */

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={cn(
            "mt-0.5 w-5 h-5 rounded border-2 border-silver/50 bg-charcoal",
            "checked:bg-gold checked:border-gold",
            "focus:ring-2 focus:ring-gold/30 focus:ring-offset-0",
            "transition-colors duration-200 cursor-pointer",
            error && "border-error",
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm text-white cursor-pointer select-none"
          >
            {label}
          </label>
        )}
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

/* ============================================
   Radio
   ============================================ */

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          type="radio"
          id={inputId}
          className={cn(
            "mt-0.5 w-5 h-5 rounded-full border-2 border-silver/50 bg-charcoal",
            "checked:bg-gold checked:border-gold",
            "focus:ring-2 focus:ring-gold/30 focus:ring-offset-0",
            "transition-colors duration-200 cursor-pointer",
            error && "border-error",
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm text-white cursor-pointer select-none"
          >
            {label}
          </label>
        )}
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

Radio.displayName = "Radio";

export { Input, Textarea, Select, Checkbox, Radio };
