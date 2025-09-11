import React from "react";
import { cn } from "@/lib/utils";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

const Layout = ({
  children,
  className,
  showNavigation = true,
  showFooter = true,
  navigationProps = {},
  footerProps = {},
  ...props
}) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {showNavigation && <Navigation {...navigationProps} />}

      <main
        className={cn("flex-1", showNavigation && "pt-0", className)}
        {...props}
      >
        {children}
      </main>

      {showFooter && <Footer {...footerProps} />}
    </div>
  );
};

const Container = ({ children, className, size = "default", ...props }) => {
  const sizes = {
    sm: "max-w-2xl",
    default: "max-w-6xl",
    lg: "max-w-7xl",
    xl: "max-w-none",
  };

  return (
    <div
      className={cn("mx-auto px-4 sm:px-6 lg:px-8", sizes[size], className)}
      {...props}
    >
      {children}
    </div>
  );
};

const Section = ({
  children,
  className,
  padding = "default",
  background = "transparent",
  ...props
}) => {
  const paddings = {
    none: "py-0",
    sm: "py-8",
    default: "py-12",
    lg: "py-16",
    xl: "py-20",
  };

  const backgrounds = {
    transparent: "",
    glass: "glass",
    subtle: "bg-zinc-900/20",
  };

  return (
    <section
      className={cn(paddings[padding], backgrounds[background], className)}
      {...props}
    >
      {children}
    </section>
  );
};

const Grid = ({
  children,
  className,
  cols = "default",
  gap = "default",
  ...props
}) => {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    default: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  const gaps = {
    sm: "gap-4",
    default: "gap-6",
    lg: "gap-8",
    xl: "gap-12",
  };

  return (
    <div
      className={cn("grid", colClasses[cols], gaps[gap], className)}
      {...props}
    >
      {children}
    </div>
  );
};

const Flex = ({
  children,
  className,
  direction = "row",
  align = "start",
  justify = "start",
  gap = "default",
  wrap = false,
  ...props
}) => {
  const directions = {
    row: "flex-row",
    col: "flex-col",
    "row-reverse": "flex-row-reverse",
    "col-reverse": "flex-col-reverse",
  };

  const aligns = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifies = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const gaps = {
    sm: "gap-2",
    default: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  return (
    <div
      className={cn(
        "flex",
        directions[direction],
        aligns[align],
        justifies[justify],
        gaps[gap],
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Layout, Container, Section, Grid, Flex };
