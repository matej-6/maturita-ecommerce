import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function CategoriesPage() {
  return (
    <div className="flex-1 flex flex-col gap-4">
      <div>
        <Link href={"categories/new-category"}>
          <Button className="font-secondary">Add New Category</Button>
        </Link>
      </div>
      <div className="bg-muted dark:bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-4 flex flex-col"></div>
    </div>
  );
}
