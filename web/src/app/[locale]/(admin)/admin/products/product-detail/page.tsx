"use server";

export default async function ProductDetailPage({
  searchParams: params,
}: {
  searchParams: Promise<{
    id?: string;
  }>;
}) {
  const { id } = await params;

  const parsedId = parseInt(id || "", 10);

  if (isNaN(parsedId)) {
    return (
      <div className="text-red-500">Invalid product ID provided in query.</div>
    );
  }

  return (
    <div className="bg-muted/50 dark:bg-muted/50 flex flex-col flex-1 rounded-xl p-6">
      <h1 className="text-3xl mb-8">Product Detail - ID: {id}</h1>
      <div className="flex flex-col gap-y-8">
        {/* Product detail content goes here */}
      </div>
    </div>
  );
}
