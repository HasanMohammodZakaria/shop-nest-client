import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary hover:bg-primary-dark text-white",
  secondary: "bg-secondary hover:bg-secondary-light text-white",
  outline: "border border-primary text-primary hover:bg-primary hover:text-white",
  danger: "bg-error hover:opacity-90 text-white",
};

export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}