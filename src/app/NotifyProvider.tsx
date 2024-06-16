"use client";
import { KnockFeedProvider, KnockProvider } from "@knocklabs/react";
// Required CSS import, unless you're overriding the styling
// import "@knocklabs/react/dist/index.css";
import { ReactNode } from "react";

export const NotifyProvider = ({
  children,
  userId,
}: {
  userId: string;
  children: ReactNode;
}) => {
  if (!userId) return <div>{children}</div>;

  return (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY!}
      userId={userId}
    >
      <KnockFeedProvider feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_ID!}>
        {children}
      </KnockFeedProvider>
    </KnockProvider>
  );
};
