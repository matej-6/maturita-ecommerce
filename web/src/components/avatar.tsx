"use client";

import { useSession } from "@/lib/tanstack-query/queries";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { getImageSrc } from "@/app/lib/utils";

export const AvatarSizeClasses = {
  sm: "size-8",
  md: "size-12",
  lg: "size-20",
};

export function Avatar({
  size = "md",
}: {
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
}) {
  const session = useSession();

  if (!session.data) {
    return (
      <Skeleton
        className={cn("rounded-full bg-gray-200", AvatarSizeClasses[size])}
      />
    );
  }

  const imageUrl = session.data.avatar
    ? getImageSrc(session.data.avatar.mimeType, session.data.avatar.base64)
    : null;

  const backupString = session.data.firstName[0]?.toUpperCase() || "";

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center overflow-hidden bg-gray-200",
        AvatarSizeClasses[size]
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
