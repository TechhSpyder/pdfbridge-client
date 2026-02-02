import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { VariantProps } from 'tailwind-variants';
import { headingStyles, labelStyles, paragraphStyles, subHeadingStyles } from './typography.styles';

/* -------------------------------------------------------------------------------------------------
 * Heading
 * -----------------------------------------------------------------------------------------------*/

const as = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

type HeadingElement = React.ElementRef<'h1'>;
type HeadingOwnProps = React.ComponentPropsWithoutRef<'h1'>;

type HeadingVariants = VariantProps<typeof headingStyles>;

type HeadingProps = {
  as?: (typeof as)[number];
  asChild?: boolean;
} & HeadingVariants &
  HeadingOwnProps;

const Heading = forwardRef<HeadingElement, HeadingProps>((props, ref) => {
  const {
    asChild = false,
    as: Tag = 'h2',
    children,
    className,
    size,
    weight,
    ...headingProps
  } = props;

  return (
    <Slot ref={ref} {...headingProps} className={headingStyles({ size, weight, className })}>
      {asChild ? children : <Tag>{children}</Tag>}
    </Slot>
  );
});

Heading.displayName = 'Heading';

/* -------------------------------------------------------------------------------------------------
 * Label
 * -----------------------------------------------------------------------------------------------*/

type LabelElement = React.ElementRef<'span'>;
type LabelOwnProps = React.ComponentPropsWithoutRef<'span'>;

type LabelVariants = VariantProps<typeof labelStyles>;

type LabelProps = {
  asChild?: boolean;
} & LabelVariants &
  LabelOwnProps;

const Label = forwardRef<LabelElement, LabelProps>((props, ref) => {
  const { asChild = false, children, className, size, weight, ...labelProps } = props;

  return (
    <Slot ref={ref} {...labelProps} className={labelStyles({ size, weight, className })}>
      {asChild ? children : <span>{children}</span>}
    </Slot>
  );
});

Label.displayName = 'Label';

/* -------------------------------------------------------------------------------------------------
 * Paragraph
 * -----------------------------------------------------------------------------------------------*/

type ParagraphElement = React.ElementRef<'p'>;
type ParagraphOwnProps = React.ComponentPropsWithoutRef<'p'>;

type ParagraphVariants = VariantProps<typeof paragraphStyles>;

type ParagraphProps = {
  asChild?: boolean;
} & ParagraphVariants &
  ParagraphOwnProps;

const Paragraph = forwardRef<ParagraphElement, ParagraphProps>((props, ref) => {
  const { asChild = false, children, className, size, weight, ...paragraphProps } = props;

  const Comp = asChild ? Slot : 'p';

  return (
    <Comp ref={ref} {...paragraphProps} className={paragraphStyles({ size, weight, className })}>
      {children}
    </Comp>
  );
});

Paragraph.displayName = 'Paragraph';

/* -------------------------------------------------------------------------------------------------
 * SubHeading
 * -----------------------------------------------------------------------------------------------*/

type SubHeadingElement = React.ElementRef<'span'>;
type SubHeadingOwnProps = React.ComponentPropsWithoutRef<'span'>;

type SubHeadingVariants = VariantProps<typeof subHeadingStyles>;

type SubHeadingProps = {
  asChild?: boolean;
} & SubHeadingVariants &
  SubHeadingOwnProps;

const SubHeading = forwardRef<SubHeadingElement, SubHeadingProps>((props, ref) => {
  const { asChild = false, children, className, size, weight, ...subHeadingProps } = props;

  return (
    <Slot ref={ref} {...subHeadingProps} className={subHeadingStyles({ size, weight, className })}>
      {asChild ? children : <span>{children}</span>}
    </Slot>
  );
});

SubHeading.displayName = 'SubHeading';

export { Heading, Label, Paragraph, SubHeading };
