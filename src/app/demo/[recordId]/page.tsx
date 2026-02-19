import { DemoProvider } from "@/lib/DemoContext";
import HomePage from "@/components/HomePage";

export const dynamic = "force-dynamic";

export default async function DemoPage({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const { recordId } = await params;

  return (
    <DemoProvider recordId={recordId}>
      <HomePage />
    </DemoProvider>
  );
}
