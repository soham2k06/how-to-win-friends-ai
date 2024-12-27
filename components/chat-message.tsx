import React from "react";
import Markdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";
import { Message } from "ai";

function ChatMessage({ msg }: { msg: Message }) {
  return (
    <li className="flex flex-col gap-2">
      <div
        className={cn(
          "max-w-3xl mx-auto w-full flex even:pb-4 items-start gap-2",
          {
            "flex-row-reverse": msg.role === "user",
          }
        )}
      >
        {msg.role === "assistant" && (
          <Bot className="text-foreground flex-shrink-0" />
        )}
        <div
          className={cn({
            "bg-muted text-foreground rounded-br-none p-2 rounded-lg":
              msg.role === "user",
          })}
        >
          <Markdown className="leading-8 prose-invert prose text-foreground/75">
            {msg.content as string}
          </Markdown>
        </div>
      </div>
    </li>
  );
}

export default ChatMessage;
