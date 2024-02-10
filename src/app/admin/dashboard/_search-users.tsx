"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
export const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="relative mx-auto mb-4 w-full max-w-7xl">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          const queryTerm = formData.get("search") as string;
          router.push(pathname + "?search=" + queryTerm);
        }}
        className="flex w-full gap-3"
      >
        {/* <Label htmlFor="search">Search for Users</Label> */}
        <Input
          id="search"
          name="search"
          type="text"
          placeholder="search user...."
          className="w-full"
        />
        <Button
          type="submit"
          className="absolute right-0 bg-transparent hover:text-white"
        >
          <Search className="text-gray-700 hover:text-white" />
        </Button>
      </form>
    </div>
  );
};
