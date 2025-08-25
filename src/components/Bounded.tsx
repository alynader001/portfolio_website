import React from "react";
import clsx from "clsx";

type BoundedProps = {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
};

const Bounded = React.forwardRef<HTMLDivElement, BoundedProps>(
  ({ as: Comp = "section", className, children, ...restProps }, ref) => {
    return (
      // @ts-expect-error: This is a known false positive with dynamic component types.
      <Comp
        // @ts-expect-error: suppress error
        ref={ref}
        // @ts-expect-error: suppress error
        className={clsx("px-4 py-10 md:px-6 md:py-14 lg:py-16", className)}
        {...restProps}
      >
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </Comp>
    );
  },
);

// Set a display name for the component
Bounded.displayName = "Bounded";

export default Bounded;