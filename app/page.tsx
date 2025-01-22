"use client";

import React from "react";
import { ArrowUpIcon, Bot, Loader2, Square } from "lucide-react";

import ChatMessage from "@/components/chat-message";
import { Button } from "@/components/ui/button";
import { Message, useChat } from "ai/react";
import { Input } from "@/components/ui/input";

function HomePage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);

  const scrollRef = React.useRef<HTMLUListElement>(null);

  const { messages, input, append, handleInputChange, handleSubmit, stop } =
    useChat({
      onResponse: () => {
        setIsTyping(true);
        setIsLoading(false);
      },
      onFinish: () => setIsTyping(false),
    });

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    handleSubmit();
  }

  React.useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
  }, [messages]);

  React.useEffect(() => {
    setIsLoading(true);
    append({
      id: "initial-msg",
      content: "Hello! Kindly introduce me the book in one short sentence.",
      role: "user",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col w-full px-4 pt-4 mx-auto h-full justify-between">
      <ul className="space-y-4 overflow-y-auto" ref={scrollRef}>
        {messages
          .filter((msg) => (msg as Message).id !== "initial-msg")
          .map((m, i) => (
            <ChatMessage key={i} msg={m} />
          ))}
        {isLoading && (
          <li className="flex flex-col gap-2">
            <div
              className={
                "max-w-3xl mx-auto w-full flex even:pb-4 items-start gap-2"
              }
            >
              <Bot className="text-foreground flex-shrink-0" />
              <div className="bg-muted-foreground size-6 rounded-full animate-pulse"></div>
            </div>
          </li>
        )}
      </ul>

      <form
        className="w-full max-w-3xl sticky bottom-0 mt-8 mx-auto shrink-0"
        onSubmit={handleSend}
      >
        <div className="relative">
          <Input
            autoFocus
            className="w-full text-base bg-secondary h-12 pr-12"
            value={input}
            placeholder="Discuss your problems here..."
            onChange={handleInputChange}
          />
          <Button
            className="absolute top-1/2 -translate-y-1/2 size-8 right-2 cursor-pointer"
            size="icon"
            type={isTyping ? "button" : "submit"}
            disabled={isTyping ? false : !input || isLoading}
            onClick={
              isTyping
                ? () => {
                    stop();
                    setIsTyping(false);
                  }
                : undefined
            }
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : isTyping ? (
              <Square className="bg-foreground rounded" />
            ) : (
              <ArrowUpIcon />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default HomePage;
