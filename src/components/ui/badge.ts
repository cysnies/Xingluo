import { cva } from "class-variance-authority";

/** Badge 组件的样式变体定义 */
export const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 dark:bg-destructive/60",
        outline:
          "border-border text-foreground hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeVariant = NonNullable<
  Parameters<typeof badgeVariants>[0]
>["variant"];
