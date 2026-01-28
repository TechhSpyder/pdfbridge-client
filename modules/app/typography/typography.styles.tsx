import { tv } from "tailwind-variants";

export const headingStyles = tv({
  base: "font-sans text-text-primary",
  variants: {
    size: {
      ["1"]: "text-2xl leading-[1.75rem]",
      ["2"]: "text-[3rem] leading-[3.5rem] tracking-tighter",
      ["3"]: "text-[2.5rem] leading-[3rem] tracking-tighter",
      ["4"]: "text-[2rem] leading-[2.5rem] tracking-tight",
      ["5"]: "text-[1.5rem] leading-[2rem] tracking-normal",
      ["6"]: "text-[1.25rem] leading-[1.75rem] tracking-normal",
      ["7"]: "text-[1.125rem] leading-[1.75rem] tracking-normal",
    },
    weight: {
      light: "font-light",
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    size: "4",
    weight: "medium",
  },
});

export const labelStyles = tv({
  base: "font-sans text-text-primary",
  variants: {
    size: {
      ["xl"]: "text-lg leading-[2rem]",
      ["lg"]: "text-[1.125rem] leading-[1.5rem]",
      ["md"]: "text-base leading-[1.5rem]",
      ["sm"]: "text-sm leading-[1.25rem]",
      ["xs"]: "text-xs leading-[1rem]",
    },
    weight: {
      light: "font-light",
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    size: "sm",
    weight: "medium",
  },
});

export const paragraphStyles = tv({
  base: "font-sans text-text-secondary",
  variants: {
    size: {
      ["xl"]: "text-[1.5rem] leading-[2rem]",
      ["lg"]: "text-[1.125rem] leading-[1.5rem]",
      ["md"]: "text-base leading-[1.125rem]",
      ["sm"]: "text-sm leading-[1rem]",
      ["xs"]: "text-xs leading-[1rem]",
    },
    weight: {
      light: "font-light",
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    size: "md",
    weight: "regular",
  },
});

export const subHeadingStyles = tv({
  base: "font-sans text-text-primary",
  variants: {
    size: {
      ["md"]: "text-base leading-[1.5rem]",
      ["sm"]: "text-sm leading-[1.25rem]",
      ["xs"]: "text-xs leading-[1rem]",
      ["2xs"]: "text-xxs leading-[0.75rem]",
    },
    weight: {
      light: "font-light",
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    size: "xs",
    weight: "medium",
  },
});
