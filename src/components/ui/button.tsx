// Adapted from shadcn/ui's MIT-licensed Button:
// https://ui.shadcn.com/r/styles/new-york/button.json
// Site tokens and the shared native focus owner replace the starter theme.
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:whitespace-normal tw:rounded-control tw:font-sans tw:text-control tw:font-label tw:cursor-pointer tw:transition-colors tw:disabled:pointer-events-none tw:disabled:cursor-not-allowed tw:disabled:opacity-50 tw:motion-reduce:transition-none',
  {
    variants: {
      variant: {
        default: 'tw:border tw:border-primary tw:bg-primary tw:text-primary-foreground',
        outline: 'tw:border tw:border-input tw:bg-background tw:text-foreground tw:hover:bg-secondary',
        ghost: 'tw:border tw:border-transparent tw:bg-transparent tw:text-foreground tw:hover:bg-secondary',
      },
      size: {
        default: 'tw:min-h-11 tw:px-4 tw:py-2',
        sm: 'tw:min-h-11 tw:px-3 tw:py-1.5',
        icon: 'tw:size-11 tw:p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : 'button';
    return <Component ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
