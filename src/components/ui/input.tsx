import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    // Base styles - touch-friendly
                    "flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3",
                    "text-base text-gray-900 placeholder:text-gray-400",
                    "min-h-touch", // Touch-friendly height (44px)
                    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    // Better mobile input experience
                    "transition-colors",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
