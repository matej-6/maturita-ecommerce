"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import { Card } from "./ui/card";
import { ArrowRightIcon, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  getLLMTaskByIdAction,
  newLLMTaskAction,
} from "@/app/data-access-layer/llm/actions";
import { getProductIdBySlugAction } from "@/app/data-access-layer/product/actions";
import { LlmTaskStatus } from "@/graphql/graphql";
import { getImageSrc } from "@/app/lib/utils";
import { ProductCard } from "./prdouct-cart";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { CurrentSession } from "@/app/data-access-layer/auth/queries";

export function Chatbot({
  sessionPromise,
}: {
  sessionPromise: Promise<CurrentSession | null>;
}) {
  const session = use(sessionPromise);
  const t = useTranslations("chatbot");
  const pathname = usePathname();

  const isLoggedIn = !!session;
  const productSlug = useMemo(() => {
    const pathParts = pathname.split("/");
    const productPartIndex = pathParts.findIndex((part) => part === "product");
    if (productPartIndex === -1) {
      return null;
    }
    if (pathParts.length > productPartIndex + 1) {
      const slug = pathParts[productPartIndex + 1];
      if (slug.includes("?")) {
        return slug.split("?")[0];
      }
      return slug;
    }
    return null;
  }, [pathname]);

  const {
    mutate: sendPrompt,
    isPending: isSendingPrompt,
    reset: resetPrompt,
  } = useMutation({
    mutationFn: async (prompt: string) => {
      if (!isLoggedIn || isWaitingForResponse || prompt.trim() === "") return;

      setIsWaitingForResponse(true);
      let productId: number | null = null;
      if (productSlug) {
        const res = await getProductIdBySlugAction(productSlug);
        if (!res.success || !res.data?.productBySlug?.id) {
          setPastChats((chats) => [
            ...chats,
            {
              question: prompt,
              response: {
                text: !res.success
                  ? res.message
                  : "An unexpected error occurred while fetching product information. Please try again later.",
                success: false,
              },
            },
          ]);
          setIsWaitingForResponse(false);
          return;
        }
        productId = res.data.productBySlug.id;
      }

      const res = await newLLMTaskAction(prompt, productId || undefined);
      if (!res.success || !res.data?.createLlmTask?.id) {
        setPastChats((chats) => [
          ...chats,
          {
            question: prompt,
            response: {
              text: !res.success
                ? res.message
                : "An unexpected error occurred while processing your request. Please try again later.",
              success: false,
            },
          },
        ]);
        setIsWaitingForResponse(false);
        return;
      }

      const llmTaskId = res.data.createLlmTask.id;

      try {
        const interval = setInterval(async () => {
          const res = await getLLMTaskByIdAction(llmTaskId);
          if (res.success && res.data?.getUserLLMTaskById) {
            const task = res.data.getUserLLMTaskById;
            if (task.status === LlmTaskStatus.Completed) {
              setPastChats((chats) => [
                ...chats,
                {
                  question: prompt,
                  response: {
                    text: task.response?.text || "",
                    products: task.response?.products
                      ? task.response?.products.map((p) => ({
                          ...p,
                          name: p.name || null,
                          imageUrl: p.thumbnailImage
                            ? getImageSrc(p.thumbnailImage.url)
                            : undefined,
                        }))
                      : undefined,
                    success: true,
                  },
                },
              ]);
              clearInterval(interval);
              setIsWaitingForResponse(false);
            } else if (task.status === LlmTaskStatus.Failed) {
              setPastChats((chats) => [
                ...chats,
                {
                  question: prompt,
                  response: {
                    text:
                      task.response?.text ||
                      "An error occurred while generating the response.",
                    success: false,
                  },
                },
              ]);
              clearInterval(interval);
              setIsWaitingForResponse(false);
            }
          } else {
            throw new Error("Failed to fetch LLM task status.");
          }
        }, 2000);
      } catch (error) {
        console.error(error);
        setIsWaitingForResponse(false);
      }
    },
    onSettled: () => {
      setInputValue("");
    },
    onError: () => {
      setIsWaitingForResponse(false);
    },
  });

  useEffect(() => {
    setPastChats([]);
    setIsOpen(false);
    setInputValue("");
    setIsWaitingForResponse(false);
    resetPrompt();
  }, [session, resetPrompt]);

  const [isOpen, setIsOpen] = useState(false);

  const [pastChats, setPastChats] = useState<
    Array<{
      question: string;
      response: {
        text: string;
        products?: {
          id: number;
          slug: string;
          name: string | null;
          imageUrl?: string;
        }[];
        success: boolean;
      };
    }>
  >([]);

  const [inputValue, setInputValue] = useState("");

  const chatsRef = useRef<HTMLDivElement>(null);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  useEffect(() => {
    const chatsDiv = chatsRef.current;
    if (chatsDiv) {
      chatsDiv.scrollTo({ top: chatsDiv.scrollHeight, behavior: "smooth" });
    }
  }, [pastChats, isSendingPrompt, isOpen]);
  // if (!isOpen) {
  //   return (
  //     <button
  //       onClick={() => setIsOpen(true)}
  //       className="rounded-full hover:cursor-pointer size-12 flex justify-center items-center overflow-hidden bg-zinc-100 text-zinc-900 font-bold border border-zinc-200 shadow-lg hover:shadow-xl transition-shadow mb-2"
  //     >
  //       <span>AI</span>
  //     </button>
  //   );
  // }

  return (
    <div className="fixed bottom-0 right-2 sm:right-4 lg:right-32 flex justify-end z-[99]">
      <div className="relative">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full hover:cursor-pointer size-12 flex justify-center items-center overflow-hidden bg-zinc-100 text-zinc-900 font-bold border border-zinc-200 shadow-lg hover:shadow-xl transition-shadow mb-2 absolute bottom-0 right-0"
        >
          <span>AI</span>
        </button>
        <Card
          className={cn(
            "w-[360px] h-fit flex flex-col gap-y-0 rounded-b-none p-0! transition-transform duration-150 absolute bottom-0 right-0",
            {
              "translate-y-full": !isOpen,
              "translate-y-0": isOpen,
            },
          )}
        >
          <div className="w-full flex justify-end items-center py-1 px-2">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-zinc-100 transition-colors"
            >
              <XIcon className="size-4" />
            </button>
          </div>
          <div className="h-px w-full bg-accent" />
          {isLoggedIn ? (
            <div className="py-1 px-2 flex flex-col gap-y-1">
              <div
                ref={chatsRef}
                className="overflow-y-scroll h-[360px] flex flex-col gap-y-2"
              >
                <div className="flex flex-col gap-y-1">
                  <div className="font-bold text-muted-foreground text-sm">
                    AI
                  </div>
                  <div>{t("firstMessage")}</div>
                </div>
                {pastChats.map((chat, index) => (
                  <div className="flex flex-col gap-y-1" key={index}>
                    <div>
                      <div className="font-bold text-muted-foreground text-sm">
                        You
                      </div>
                      <div className="mb-1">{chat.question}</div>
                    </div>
                    <div>
                      <div className="font-bold text-muted-foreground text-sm">
                        AI
                      </div>
                      <div
                        className={
                          chat.response.success ? "" : "text-red-600 font-bold"
                        }
                      >
                        {chat.response.text}
                      </div>
                      {chat.response.products &&
                        chat.response.products.length > 0 && (
                          <div className="mt-2 grid grid-cols-1 gap-2">
                            {chat.response.products.map((product) => (
                              <ProductCard
                                key={product.id}
                                product={{
                                  ...product,
                                  name: product.name || product.slug,
                                }}
                              />
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
                {isWaitingForResponse && (
                  <div className="flex flex-col gap-y-0 mt-auto">
                    <div className="font-bold text-muted-foreground text-sm">
                      AI
                    </div>
                    <div>{t("generatingResponse")}</div>
                  </div>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendPrompt(inputValue);
                }}
                className="w-full gap-x-1 flex items-center"
              >
                <input
                  className="h-6 pl-2 w-full"
                  placeholder={t("inputPlaceholder")}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isWaitingForResponse || isSendingPrompt}
                />
                <button
                  type="submit"
                  disabled={
                    isWaitingForResponse ||
                    isSendingPrompt ||
                    inputValue.trim() === ""
                  }
                  className="p-2 rounded-full hover:bg-zinc-100 transition-colors"
                >
                  <ArrowRightIcon className="size-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="py-1 px-2 h-[360px]">{t("notLoggedIn")}</div>
          )}
        </Card>
      </div>
    </div>
  );
}
