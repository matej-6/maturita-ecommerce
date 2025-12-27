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
        success: boolean;
      };
    }>
  >([
    {
      question: "What can you do?",
      response: {
        text: "I can help you with product recommendations, answer questions about products, and assist you with your shopping experience. Just ask me anything!",
        success: true,
      },
    },
    {
      question: "Can you recommend a product for me?",
      response: {
        text: "Sure! Based on your browsing history, I recommend checking out our latest collection of wireless headphones. They offer great sound quality and comfort for long listening sessions.",
        success: true,
      },
    },
    {
      question: "What is the return policy?",
      response: {
        text: "Our return policy allows you to return most items within 30 days of purchase for a full refund. Please ensure that the items are in their original condition and packaging. Some restrictions may apply for certain products.",
        success: true,
      },
    },
  ]);

  const [inputValue, setInputValue] = useState("");

  const chatsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatsDiv = chatsRef.current;
    if (chatsDiv) {
      chatsDiv.scrollTo({ top: chatsDiv.scrollHeight, behavior: "smooth" });
    }
  }, [pastChats]);

  const { mutate: sendPrompt, isPending: isSendingPrompt } = useMutation({
    mutationFn: async (prompt: string) => {
      if (!isLoggedIn || prompt.trim() === "") return;

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
        return;
      }

      const llmTaskId = res.data.createLlmTask.id;

      // retry every 2 seconds to get the response
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
                  text: task.response || "",
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
                    task.response ||
                    "An error occurred while generating the response.",
                  success: false,
                },
              },
            ]);
            clearInterval(interval);
          }
        }
      }, 2000);
    },
  });

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
    <Card className="w-[248px] h-fit flex flex-col gap-y-0 rounded-b-none p-0!">
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
          <div ref={chatsRef} className="overflow-y-scroll h-[360px]">
            {pastChats.map((chat, index) => (
              <div key={index} className="mb-2">
                <div className="font-bold">You:</div>
                <div className="mb-1">{chat.question}</div>
                <div className="font-bold">AI:</div>
                <div
                  className={
                    chat.response.success ? "" : "text-red-600 font-bold"
                  }
                >
                  {chat.response.text}
                </div>
              </div>
            ))}
            {isSendingPrompt && (
              <div className="mb-2">
                <div className="font-bold">AI:</div>
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
              disabled={isSendingPrompt}
            />
            <button
              type="submit"
              disabled={isSendingPrompt || inputValue.trim() === ""}
              className="p-2 rounded-full hover:bg-zinc-100 transition-colors"
            >
              <ArrowRightIcon className="size-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="py-1 px-2">
          You must be logged in to use the chatbot.
        </div>
      )}
    </Card>
  );
}
