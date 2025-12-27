import { cn } from "@/lib/utils";
import { AddToCartButton } from "./add-to-cart-button";
import { Card } from "./ui/card";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ResponsiveButton } from "./responsive-button";

export type ProductCardType = {
  id: number;
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
};

export function ProductCard({
  product,
  className,
  ...rest
}: { product: ProductCardType } & React.ComponentPropsWithRef<"div">) {
  const t = useTranslations("productVariantCard");

  return (
    <Card
      key={product.id}
      className={cn(
        "w-[196px] sm:w-[248px] h-fit flex flex-col gap-y-2 sm:gap-y-4 p-1.5 sm:p-2 shrink-0",
        className
      )}
      {...rest}
    >
      <div className="w-full aspect-square rounded-md overflow-hidden object-cover">
        {product.imageUrl && (
          <img
            className="size-full"
            src={product.imageUrl}
            alt={product.name}
          />
        )}
      </div>
      <Link
        href={`/product/${product.slug}`}
        className="font-medium text-lg sm:text-xl h-14 line-clamp-2"
      >
        {product.name}
      </Link>
      <p className="text-sm sm:text-base font-light text-accent-foreground line-clamp-3 h-14 sm:h-18">
        {product.description}
      </p>

      <ResponsiveButton>View Product</ResponsiveButton>
    </Card>
  );
}
