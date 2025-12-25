import { cn } from "@/lib/utils";
import { AddToCartButton } from "./add-to-cart-button";
import { Card } from "./ui/card";
import { useTranslations } from "next-intl";

export type CardVariant = {
  id: number;
  name: string;
  description?: string;
  productSlug: string;
  sku: string;
  priceInCents: number;
  imageUrl?: string;
};

export function ProductVariantCard({
  variant,
  className,
  ...rest
}: { variant: CardVariant } & React.ComponentPropsWithRef<"div">) {
  const t = useTranslations("productVariantCard");

  return (
    <Card
      key={variant.id}
      className={cn(
        "w-[196px] sm:w-[248px] h-fit flex flex-col gap-y-2 sm:gap-y-4 p-1.5 sm:p-2 shrink-0",
        className
      )}
      {...rest}
    >
      <div className="w-full aspect-square rounded-md overflow-hidden object-cover">
        {variant.imageUrl && (
          <img
            className="size-full"
            src={variant.imageUrl}
            alt={variant.name}
          />
        )}
      </div>
      <span className="font-medium text-lg sm:text-xl h-14 line-clamp-2">
        {variant.name}
      </span>
      <p className="text-sm sm:text-base font-light text-accent-foreground line-clamp-3 h-14 sm:h-18">
        {variant.description}
      </p>
      <span className="text-base sm:text-lg font-bold">
        {variant.priceInCents / 100} €
      </span>
      <AddToCartButton
        productVariantId={variant.id}
        quantity={1}
        buttonProps={{ size: "sm" }}
        className="block sm:hidden"
      >
        {t("addToCartButton")}
      </AddToCartButton>
      <AddToCartButton
        productVariantId={variant.id}
        quantity={1}
        className="hidden sm:block"
      >
        {t("addToCartButton")}
      </AddToCartButton>
    </Card>
  );
}
