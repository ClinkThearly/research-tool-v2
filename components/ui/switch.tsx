"use client";

import * as React from "react";
import * as SwitchPr from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPr.Root> {}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPr.Root>, SwitchProps>(
  ({ className, ...props }, ref) => (
    <SwitchPr.Root
      ref={ref}
      className={cn(
        "relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full border-2 border-transparent " +
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
        "disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className
      )}
      {...props}
    >
      <SwitchPr.Thumb
        className="pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      />
    </SwitchPr.Root>
  )
);

Switch.displayName = SwitchPr.Root.displayName;

export { Switch };
