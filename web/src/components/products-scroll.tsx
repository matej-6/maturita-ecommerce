"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CardVariant, ProductVariantCard } from "./product-variant-card";

type Props = {
  variants: CardVariant[];
  header: string;
};

export function ProductsScroll({ variants, header }: Props) {
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

    window.addEventListener("resize", handleScroll);

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
      window.removeEventListener("resize", handleScroll);

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
    <div className="flex flex-col gap-y-3 sm:gap-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-semibold">{header}</h2>
        <div className="flex items-center gap-x-1 sm:gap-x-2">
          <button
            disabled={backDisabled}
            onClick={() => {
              firstVariantRef.current?.parentElement?.scrollBy({
                left: -100,
                behavior: "smooth",
              });
            }}
            className="rounded-full p-1 sm:p-2 bg-primary disabled:bg-muted text-primary-foreground disabled:text-muted-foreground"
          >
            <ArrowLeftIcon className="size-4 sm:size-6" />
          </button>
          <button
            disabled={forwardDisabled}
            onClick={() => {
              lastVariantRef.current?.parentElement?.scrollBy({
                left: 100,
                behavior: "smooth",
              });
            }}
            className="rounded-full p-1 sm:p-2 bg-primary disabled:bg-muted text-primary-foreground disabled:text-muted-foreground rotate-180"
          >
            <ArrowLeftIcon className="size-4 sm:size-6" />
          </button>
        </div>
      </div>
      <div className="flex gap-x-2 sm:gap-x-4 overflow-x-auto max-w-full">
        {variants.map((v, i) => {
          return (
            <ProductVariantCard
              ref={
                i === variants.length - 1
                  ? lastVariantRef
                  : i === 0
                  ? firstVariantRef
                  : null
              }
              variant={v}
              key={v.id}
            />
          );
        })}
      </div>
    </div>
  );
}
