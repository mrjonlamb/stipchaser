"use client";

import dynamic from "next/dynamic";

const DocumentManagement = dynamic(
  () => import("../../src/page-components/document-management"),
  {
    ssr: false,
  }
);

export default function DocumentManagementPage() {
  return <DocumentManagement />;
}
