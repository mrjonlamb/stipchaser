"use client";

import dynamic from "next/dynamic";

const DocumentManagement = dynamic(
  () => import("../../src/pages/document-management"),
  {
    ssr: false,
  }
);

export default function DocumentManagementPage() {
  return <DocumentManagement />;
}
