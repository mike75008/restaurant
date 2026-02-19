"use client";

import { use } from "react";
import HomePage from "@/components/HomePage";
import { DemoProvider } from "@/lib/DemoContext";

export default function DemoPage({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const { recordId } = use(params);

  return (
    <DemoProvider recordId={recordId}>
      <HomePage />
    </DemoProvider>
  );
}
