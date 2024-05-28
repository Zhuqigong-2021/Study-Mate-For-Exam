"use client";
import { useState } from "react";
import AIChatBox from "./AIChatBox";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";

export default function AIChatButton() {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setChatBoxOpen(true)}
        className="flex h-14 w-14 flex-col items-center justify-center rounded-full bg-teal-600 dark:border-none dark:bg-background dark:text-green-500 dark:shadow-md dark:shadow-green-500 dark:hover:bg-background dark:hover:shadow-lg dark:hover:shadow-green-400"
      >
        <Bot size={30} className="p-0" />
      </Button>
      <AIChatBox open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
    </>
  );
}
