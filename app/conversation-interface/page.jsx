"use client";

import dynamic from "next/dynamic";

const ConversationInterface = dynamic(
  () => import("../../src/pages/conversation-interface"),
  {
    ssr: false,
  }
);

export default function ConversationInterfacePage() {
  return <ConversationInterface />;
}
