import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { Bot, Trash2, XCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Message } from "ai";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

export default function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat(); //api/chat is the automatic route to handle gpt request , but so far not so sure if there is error

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36",
        open ? "fixed" : "hidden",
      )}
    >
      <button
        onClick={onClose}
        className="relative right-2 top-10 mb-1 ms-auto block"
      >
        <XCircle size={30} />
      </button>
      <div className="flex h-[600px] flex-col rounded border bg-background shadow-xl">
        <div className="mt-3 h-full overflow-y-auto p-2 " ref={scrollRef}>
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Thinking ... ",
              }}
            />
          )}
          {error && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Something went wrong, Please try again ",
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <div className="flex h-full items-center justify-center gap-3">
              <Bot />
              Ask the AI a question about your notes
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-2">
          <Button
            title="clear chat"
            variant="outline"
            size="icon"
            className="shrink-0"
            type="button"
            onClick={() => setMessages([])}
          >
            <Trash2 />
          </Button>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Say something..."
            ref={inputRef}
          />
          <Button type="submit" className="bg-teal-700 text-white">
            Send{" "}
          </Button>
        </form>
      </div>
    </div>
  );
}

function ChatMessage({
  message: { role, content },
}: {
  message: Pick<Message, "role" | "content">;
}) {
  const { user } = useUser();
  const isAiMessage = role === "assistant";

  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAiMessage ? "ms-5 justify-end" : "me-5 justify-start",
      )}
    >
      {!isAiMessage && user?.imageUrl && (
        <Image
          src={user.imageUrl}
          alt="User Image"
          width={40}
          height={40}
          className="mr-2 h-10 w-10 rounded-full object-cover"
        />
      )}
      <p
        className={cn(
          "round whitespace-pre-line rounded-md border px-2 py-2",
          isAiMessage
            ? "bg-background"
            : " bg-teal-600 text-primary-foreground",
        )}
      >
        {content}
      </p>
      {isAiMessage && <Bot className="ml-2 shrink-0" />}
    </div>
  );
}
