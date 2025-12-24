"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

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

  const [selectedImage, setSelectedImage] = useState<string | null>(
    thumbnailImage
      ? thumbnailImage.url
      : images.length > 0
      ? images[0].url
      : null
  );

  return (
    <div className="flex flex-col gap-y-2 sm:gap-y-6 items-start w-full">
      <div className="w-full aspect-square object-cover overflow-hidden rounded-xl flex items-center justify-center border bg-accent stroke-1 stroke-muted">
        {selectedImage ? (
          <img src={selectedImage} alt="Product variant image" />
        ) : (
          <p>{t("noImageAvailable")}</p>
        )}
      </div>
      {images.length > 0 && (
        <div className="w-[48px] sm:w-[96px] overflow-x-auto scroll gap-x-1 flex items-center justify-start">
          {images.map((image, index) => (
            <button
              hidden={selectedImage === image.url}
              onClick={() => setSelectedImage(image.url)}
              key={index}
            >
              <div
                key={index}
                className="size-12 sm:size-16 overflow-hidden rounded-sm bg-accent stroke-1 stroke-muted flex items-center justify-center"
              >
                <img
                  src={image.url}
                  alt={`Product image ${index + 1}`}
                  className="size-full object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
