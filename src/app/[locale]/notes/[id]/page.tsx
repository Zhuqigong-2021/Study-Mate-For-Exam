"use client";
import CreateQuestion from "@/components/CreateQuestion";

import React from "react";
export interface idProps {
  params: { id: string };
}
// { params }: idProps
const page = ({ params }: idProps) => {
  const { id } = params;

  return (
    <div>
      <CreateQuestion
        params={{
          id,
        }}
      />
    </div>
  );
};

export default page;
