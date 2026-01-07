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

  const scrollElementRef = useRef<HTMLDivElement | null>(null);
  const lastVariantRef = useRef<HTMLDivElement | null>(null);
  const [backDisabled, setBackDisabled] = useState(true);
  const [forwardDisabled, setForwardDisabled] = useState(false);

  useEffect(() => {
    if (variants.length <= 1) {
      setBackDisabled(true);
      setForwardDisabled(true);
      return;
    }
    const handleScroll = () => {
      if (scrollElementRef.current && lastVariantRef.current) {
        const lastElementRight =
          lastVariantRef.current.getBoundingClientRect().right;
        const scrollLeft = scrollElementRef.current.scrollLeft || 0;
        const scrollElementRight =
          scrollElementRef.current.parentElement?.getBoundingClientRect()
            .right || 0;

        setBackDisabled(scrollLeft < 1);
        setForwardDisabled(scrollElementRight >= lastElementRight - 1);
      }
    };

    handleScroll();

    window.addEventListener("resize", handleScroll);

    if (scrollElementRef.current) {
      scrollElementRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("resize", handleScroll);

      if (scrollElementRef.current) {
        scrollElementRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [variants.length, scrollElementRef]);

  return (
    <div className="flex flex-col gap-y-3 sm:gap-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-semibold">{header}</h2>
        <div className="flex items-center gap-x-1 sm:gap-x-2">
          <button
            disabled={backDisabled}
            onClick={() => {
              scrollElementRef.current?.scrollBy({
                left: -200,
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
              scrollElementRef.current?.scrollBy({
                left: 200,
                behavior: "smooth",
              });
            }}
            className="rounded-full p-1 sm:p-2 bg-primary disabled:bg-muted text-primary-foreground disabled:text-muted-foreground rotate-180"
          >
            <ArrowLeftIcon className="size-4 sm:size-6" />
          </button>
        </div>
      </div>
      <div
        className="flex gap-x-2 sm:gap-x-4 overflow-x-auto max-w-full"
        ref={scrollElementRef}
      >
        {variants.map((v, i) => {
          return (
            <ProductVariantCard
              ref={i === variants.length - 1 ? lastVariantRef : null}
              variant={v}
              key={v.id}
            />
          );
        })}
      </div>
    </div>
  );
}
