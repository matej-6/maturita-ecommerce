"use client";

import { updateUserAvatarAction } from "@/app/data-access-layer/user/actions";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";

type Props = {
  imageUrl?: string;
  firstName?: string;
};

export function UpdateAccountAvatarButton({ imageUrl, firstName }: Props) {
  const { mutate: uploadAvatar, isPending: isUploading } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      await updateUserAvatarAction(formData);
    },
    onError: (error) => {
      console.error("Failed to update user avatar:", error);
    },
  });

  return (
    <form>
      <label
        htmlFor="accountAvatarImage"
        className="rounded-full bg-gray-200 size-12 sm:size-20 flex items-center justify-center overflow-hidden object-cover relative group cursor-pointer"
      >
        <div className="size-full opacity-0 group-hover:opacity-100 bg-black/30 absolute inset-0 flex items-center justify-center transition-opacity">
          <PlusIcon className="size-6 sm:size-8 text-white" />
        </div>
        {imageUrl ? (
          <img src={imageUrl} alt="User avatar" className="size-full" />
        ) : (
          <span className="text-black text-3xl sm:text-4xl">
            {firstName?.charAt(0).toUpperCase()}
          </span>
        )}
      </label>

      <input
        id="accountAvatarImage"
        type="file"
        accept="image/*"
        multiple={false}
        className="hidden"
        onChange={async (e) => {
          if (isUploading) return;
          const file = e.target.files?.[0];
          if (!file) {
            return;
          }
          uploadAvatar(file);
        }}
      />
    </form>
  );
}
