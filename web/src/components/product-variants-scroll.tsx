"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AddToCartButton } from "./add-to-cart-button";
import { Card } from "./ui/card";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Props = {
  variants: {
    id: number;
    name: string;
    productSlug: string;
    sku: string;
    priceInCents: number;
    imageUrl?: string;
  }[];
};

export function ProductVariantsScroll({ variants }: Props) {
  const t = useTranslations("productPage");

  const lastVariantRef = useRef<HTMLDivElement | null>(null);
  const scrollElementRef = useRef<HTMLDivElement | null>(null);
  const [backDisabled, setBackDisabled] = useState(true);
  const [forwardDisabled, setForwardDisabled] = useState(false);

  useEffect(() => {
    if (variants.length <= 1) {
      setBackDisabled(true);
      setForwardDisabled(true);
      return;
    }

    const scrollEl = scrollElementRef.current;
    const lastVariantEl = lastVariantRef.current;

    const handleScroll = () => {
      if (scrollEl && lastVariantEl) {
        const lastElementRight = lastVariantEl.getBoundingClientRect().right;
        const scrollLeft = scrollEl.scrollLeft || 0;
        const parentRight =
          scrollEl.parentElement?.getBoundingClientRect().right || 0;

        setBackDisabled(scrollLeft < 1);
        setForwardDisabled(parentRight >= lastElementRight - 1);
      }
    };

    handleScroll();

    window.addEventListener("resize", handleScroll);

    if (scrollEl) {
      scrollEl.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollEl) {
        scrollEl.removeEventListener("scroll", handleScroll);
      }
    };
  }, [variants.length, scrollElementRef, lastVariantRef]);

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground font-medium">
          {t("otherVariants")}
        </h2>
        <div className="flex items-center gap-x-1 ">
          <button
            disabled={backDisabled}
            onClick={() => {
              scrollElementRef.current?.scrollBy({
                left: -100,
                behavior: "smooth",
              });
            }}
            className="rounded-full p-1 bg-primary disabled:bg-muted text-primary-foreground disabled:text-muted-foreground"
          >
            <ArrowLeftIcon className="size-4" />
          </button>
          <button
            disabled={forwardDisabled}
            onClick={() => {
              scrollElementRef.current?.scrollBy({
                left: 100,
                behavior: "smooth",
              });
            }}
            className="rounded-full p-1 bg-primary disabled:bg-muted text-primary-foreground disabled:text-muted-foreground rotate-180"
          >
            <ArrowLeftIcon className="size-4" />
          </button>
        </div>
      </div>
      <div className="flex gap-x-2 overflow-x-auto max-w-full">
        {variants.map((v, i) => {
          return (
            <Card
              ref={i === variants.length - 1 ? lastVariantRef : null}
              key={v.id}
              className="w-[116px] sm:w-[164px] h-fit flex flex-col gap-y-3 p-2"
            >
              <Link
                href={`/product/${v.productSlug}?variant=${v.sku}`}
                className="flex flex-col gap-y-3"
              >
                <div className="w-full aspect-square rounded-md overflow-hidden flex items-center justify-center bg-muted">
                  {v.imageUrl ? (
                    <img src={v.imageUrl} alt="Variant image" />
                  ) : (
                    <p className="text-muted-foreground">
                      {t("noImageAvailable")}
                    </p>
                  )}
                </div>
                <h3 className="font-medium text-sm sm:text-base break-words break-normal">
                  {v.name}
                </h3>
              </Link>
              <AddToCartButton
                className="block sm:hidden"
                buttonProps={{
                  size: "xs",
                }}
                productVariantId={v.id}
                quantity={1}
              >
                {t("addToCartButton")}
              </AddToCartButton>
              <AddToCartButton
                className="hidden sm:block"
                buttonProps={{
                  size: "sm",
                }}
                productVariantId={v.id}
                quantity={1}
              >
                {t("addToCartButton")}
              </AddToCartButton>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
