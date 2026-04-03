"use client";

import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { CurrentSession } from "@/app/data-access-layer/auth/queries";
import { getImageSrc } from "@/app/lib/utils";

const AvatarSizeClasses = {
  xs: "size-6",
  sm: "size-8",
  md: "size-12",
  lg: "size-20",
};

export function Avatar({
  size = "md",
  session,
  imageSrc,
}: {
  session?: CurrentSession;
  imageSrc?: string;
  size?: "xs" | "sm" | "md" | "lg";
}) {
  if (!session && !imageSrc) {
    return (
      <Skeleton
        className={cn("rounded-full bg-gray-200", AvatarSizeClasses[size])}
      />
    );
  }

  const imageUrl = session
    ? getImageSrc(session.avatarUrl ?? undefined)
    : getImageSrc(imageSrc ?? "");

  const backupString = session?.firstName[0]?.toUpperCase() || "";

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center overflow-hidden bg-gray-200",
        AvatarSizeClasses[size],
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{backupString}</span>
      )}
    </div>
  );
}
