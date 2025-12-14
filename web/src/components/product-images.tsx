"use client";

import { useTranslations } from "next-intl";

type Props = {
  thumbnailImage?: {
    id: number;
    url: string;
    altText: string;
  };
  images: {
    id: number;
    url: string;
    altText: string;
  }[];
};

export function ProductImages({ images, thumbnailImage }: Props) {
  const t = useTranslations("productPage");

  return (
    <div className="flex flex-col gap-y-1">
      <div className="w-72 h-72 md:w-[400px] md:h-[400px] xl:w-[600px] xl:h-[600px] flex items-center justify-center border">
        {thumbnailImage ? (
          <img
            src={thumbnailImage.url}
            alt="Product variant image"
            className="size-full object-cover"
          />
        ) : (
          <p>{t("noImageAvailable")}</p>
        )}
      </div>
      {images.length > 0 && (
        <div className="w-72 overflow-x-auto gap-x-1 flex items-center justify-start">
          {images.map((image, index) => (
            <div key={index} className="w-16 h-16">
              <img
                src={image.url}
                alt={`Product image ${index + 1}`}
                className="size-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
