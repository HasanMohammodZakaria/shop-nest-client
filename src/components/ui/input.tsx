import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-text">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-primary ${
            error ? "border-error" : "border-border"
          } ${className}`}
          {...rest}
        />
        {error && <span className="text-sm text-error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;