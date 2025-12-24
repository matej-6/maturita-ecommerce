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
  const firstVariantRef = useRef<HTMLDivElement | null>(null);
  const [backDisabled, setBackDisabled] = useState(true);
  const [forwardDisabled, setForwardDisabled] = useState(false);

  useEffect(() => {
    if (variants.length <= 1) {
      setBackDisabled(true);
      setForwardDisabled(true);
      return;
    }
    const handleScroll = () => {
      if (firstVariantRef.current && lastVariantRef.current) {
        const firstOffset = firstVariantRef.current.offsetLeft;
        const lastRightOffset =
          lastVariantRef.current.getBoundingClientRect().right;
        const scrollLeft =
          firstVariantRef.current.parentElement?.scrollLeft || 0;
        const parentWidth =
          firstVariantRef.current.parentElement?.offsetWidth || 0;

        setBackDisabled(scrollLeft <= firstOffset);
        setForwardDisabled(parentWidth >= lastRightOffset - 20);
      }
    };

    handleScroll();

    if (firstVariantRef.current) {
      firstVariantRef.current.parentElement?.addEventListener(
        "scroll",
        handleScroll
      );
    }

    if (lastVariantRef.current) {
      lastVariantRef.current.parentElement?.addEventListener(
        "scroll",
        handleScroll
      );
    }

    return () => {
      if (firstVariantRef.current) {
        firstVariantRef.current.parentElement?.removeEventListener(
          "scroll",
          handleScroll
        );
      }
      if (lastVariantRef.current) {
        lastVariantRef.current.parentElement?.removeEventListener(
          "scroll",
          handleScroll
        );
      }
    };
  }, [variants.length, firstVariantRef, lastVariantRef]);

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground font-medium">
          Other Variants
        </h2>
        <div className="flex items-center gap-x-1 ">
          <button
            disabled={backDisabled}
            onClick={() => {
              firstVariantRef.current?.parentElement?.scrollBy({
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
              lastVariantRef.current?.parentElement?.scrollBy({
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
              ref={
                i === variants.length - 1
                  ? lastVariantRef
                  : i === 0
                  ? firstVariantRef
                  : null
              }
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
