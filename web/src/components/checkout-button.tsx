"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { checkoutAction } from "@/app/data-access-layer/checkout/actions";
import { toast } from "sonner";

export function CheckoutButton() {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => await checkoutAction(),
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again later."
      );
    },
  });

  return (
    <Button
      className="w-full"
      size={"lg"}
      onClick={() => mutate()}
      disabled={isPending}
    >
      Checkout
    </Button>
  );
}

// export async function tttt() {
//   const res = await fetch("http://localhost:11434/api/generate", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       model: "mistral:7b",
//       system:
//         "You are a trasnlator. Output only the language code of the language you detect is in prompt.",
//       prompt: "Chcem produkt na budovanie svalov",
//       stream: false,
//     }),
//   });
// }
