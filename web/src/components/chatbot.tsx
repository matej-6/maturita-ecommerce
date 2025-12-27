"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "./ui/card";
import { ArrowRightIcon, XIcon } from "lucide-react";
import { useSession } from "@/lib/tanstack-query/queries";
import { usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  getLLMTaskByIdAction,
  newLLMTaskAction,
} from "@/app/data-access-layer/llm/actions";
import { getProductIdBySlugAction } from "@/app/data-access-layer/product.queries";
import { LlmTaskStatus } from "@/graphql/graphql";
import { getImageSrc } from "@/app/lib/utils";
import { ProductCard } from "./prdouct-cart";

export function Chatbot() {
  const session = useSession();

  const pathname = usePathname();

  const isLoggedIn = !!session.data;
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

  useEffect(() => {
    console.log("Product slug:", productSlug);
  }, [productSlug]);

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

  const { mutate: sendPrompt, isPending: isSendingPrompt } = useMutation({
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
                text: "An unexpected error occurred while fetching product information. Please try again later.",
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
              text: "An unexpected error occurred while processing your request. Please try again later.",
              success: false,
            },
          },
        ]);
        setIsWaitingForResponse(false);
        return;
      }

      const llmTaskId = res.data.createLlmTask.id;

      // retry every 2 seconds to get the response
      const interval = setInterval(async () => {
        const res = await getLLMTaskByIdAction(llmTaskId);
        if (res.success && res.data?.getUserLLMTaskById) {
          setIsWaitingForResponse(false);
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
                          ? getImageSrc(
                              p.thumbnailImage.mimeType,
                              p.thumbnailImage.base64
                            )
                          : undefined,
                      }))
                    : undefined,
                  success: true,
                },
              },
            ]);
            clearInterval(interval);
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
          }
        } else {
          throw new Error("Failed to fetch LLM task status.");
        }
      }, 2000);
    },
    onSettled: () => {
      setInputValue("");
    },
    onError: () => {
      setIsWaitingForResponse(false);
    },
  });

  useEffect(() => {
    const chatsDiv = chatsRef.current;
    if (chatsDiv) {
      chatsDiv.scrollTo({ top: chatsDiv.scrollHeight, behavior: "smooth" });
    }
  }, [pastChats, isSendingPrompt, isOpen]);
  useEffect(() => {
    console.log("is waiting", isWaitingForResponse);
  }, [isWaitingForResponse]);
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full hover:cursor-pointer size-12 flex justify-center items-center overflow-hidden bg-zinc-100 text-zinc-900 font-bold border border-zinc-200 shadow-lg hover:shadow-xl transition-shadow mb-2"
      >
        <span>AI</span>
      </button>
    );
  }

  return (
    <Card className="w-[360px] h-fit flex flex-col gap-y-0 rounded-b-none p-0!">
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
            {pastChats.length > 0 ? (
              pastChats.map((chat, index) => (
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
              ))
            ) : (
              <div className="text-muted-foreground text-sm">
                No past chats available.
              </div>
            )}
            {isWaitingForResponse && (
              <div className="flex flex-col gap-y-0 mt-auto">
                <div className="font-bold text-muted-foreground text-sm">
                  AI
                </div>
                <div>Generating response...</div>
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
              placeholder="Ask me anything..."
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
        <div className="py-1 px-2 h-[360px]">
          You must be logged in to use the chatbot.
        </div>
      )}
    </Card>
  );
}
