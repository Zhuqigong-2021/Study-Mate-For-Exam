"use client";
import React from "react";
import { Button } from "./ui/button";
import { Crown } from "lucide-react";
import { setRole } from "@/app/admin/dashboard/_actions";
import { User } from "@clerk/nextjs/server";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface userType {
  userId: string;
  userRole: string;
  currentUserId: string;
}
const GrantAdmin = ({ userId, userRole, currentUserId }: userType) => {
  const router = useRouter();
  return (
    <form
      action={async (FormData) => {
        await setRole(FormData);
        router.refresh();
        if (currentUserId == "user_2aFBx8E20RdENmTS0CRlRej0Px4") {
          toast.success("You have just changed a user role");
        } else {
          toast.error("You are not authorized to change a role");
        }
      }}
    >
      <input type="hidden" value={userId} name="id" />
      <input
        type="hidden"
        value={`${userRole === "admin" ? "" : "admin"}`}
        name="role"
      />
      <Button
        type="submit"
        className={`${
          userRole === "admin" ? "bg-violet-500 " : "border bg-transparent "
        }  hover:bg-violet-800 hover:text-white`}
      >
        <Crown
          size={15}
          className={`${
            userRole === "admin" ? "text-violet-50" : "text-gray-800"
          } hover:text-white `}
        />
      </Button>
    </form>
  );
};

export default GrantAdmin;
