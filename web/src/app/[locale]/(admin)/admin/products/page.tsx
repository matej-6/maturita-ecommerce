"use server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function ProductsPage() {
  return (
    <div className="flex-1 flex flex-col gap-4">
      <Link href={"products/new-product"}>
        <Button className="w-fit">Add New Product</Button>
      </Link>
      <div className="bg-muted dark:bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-4 flex flex-col"></div>
    </div>
  );
}
