import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'destructive';
    size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        return (
            <button
                className={cn(
                    // Base styles - touch-friendly
                    "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                    "disabled:opacity-50 disabled:pointer-events-none",
                    "min-h-touch", // Touch-friendly height
                    // Variants
                    {
                        'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700': variant === 'default',
                        'border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100': variant === 'outline',
                        'hover:bg-gray-100 active:bg-gray-200': variant === 'ghost',
                        'bg-red-500 text-white hover:bg-red-600 active:bg-red-700': variant === 'destructive',
                    },
                    // Sizes
                    {
                        'px-4 py-2 text-base': size === 'default',
                        'px-3 py-1.5 text-sm': size === 'sm',
                        'px-6 py-3 text-lg': size === 'lg',
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
