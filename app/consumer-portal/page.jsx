"use client";

import dynamic from "next/dynamic";

const ConsumerPortal = dynamic(
  () => import("../../src/pages/consumer-portal"),
  {
    ssr: false,
  }
);

export default function ConsumerPortalPage() {
  return <ConsumerPortal />;
}
