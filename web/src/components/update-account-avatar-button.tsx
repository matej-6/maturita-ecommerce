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
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result?.toString().split("base64,")[1];
        if (!base64String) return;
        const mimeType = file.type;

        await updateUserAvatarAction(base64String, mimeType);
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsDataURL(file);
    },
  });

  return (
    <form>
      <label
        htmlFor="accountAvatarImage"
        className="rounded-full bg-cyan-600 size-12 sm:size-20 flex items-center justify-center overflow-hidden object-cover relative group cursor-pointer"
      >
        <div className="size-full opacity-0 group-hover:opacity-100 bg-black/30 absolute inset-0 flex items-center justify-center transition-opacity">
          <PlusIcon className="size-6 sm:size-8 text-white" />
        </div>
        {imageUrl ? (
          <img src={imageUrl} alt="User avatar" className="size-full" />
        ) : (
          <span className="text-white text-3xl sm:text-5xl font-medium">
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
          await uploadAvatar(file);
        }}
      />
    </form>
  );
}
