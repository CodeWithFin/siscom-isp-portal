import { GrowthConsole } from "@/components/growth/GrowthConsole";

export default async function ConfigurePage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  return <GrowthConsole variant="config" productId={productId} />;
}
