"use client";

import { getEditCategoryQueryDocumentData } from "@/app/data-access-layer/admin/category/queries";
import { handleGraphqlError } from "@/app/data-access-layer/admin/handleGraphqlFormError";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "@/i18n/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { EditCategoryForm } from "../edit-category-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EditCategoryPageClient({ id }: { id: string }) {
  const router = useRouter();
  const t = useTranslations("admin.categories.editCategory.page");

  const { data } = useSuspenseQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const res = await getEditCategoryQueryDocumentData(id);
      if (res.errors) {
        const error = await handleGraphqlError(res.errors);
        toast.error(error.message);
        router.push("/admin/categories");
      }

      return res;
    },
  });

  if (!data.data) {
    return notFound();
  }

  return (
    <div className="bg-muted/50 dark:bg-muted/50 flex flex-col flex-1 rounded-xl p-6 gap-y-12">
      <h1 className="text-3xl">{data.data.category.slug}</h1>
      {!data.data.category.isSetup && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>{t("setupWarning.title")}</AlertTitle>
          <AlertDescription>
            <p>{t("setupWarning.description")}</p>
            <ul className="list-inside list-disc text-sm">
              <li>{t("setupWarning.englishTranslation")}</li>
              <li>{t("setupWarning.atLeastOneVisibleProduct")}</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col gap-y-8 ">
        <EditCategoryForm
          refetchQueryKey={["category", id]}
          categoriesQuery={data}
          categoryId={id}
          data={{
            slug: data.data.category.slug,
            parentCategoryId: data.data.category.parentCategoryId || "",
          }}
        />
      </div>
      <h2 className="text-2xl">Translations</h2>
      <div className="flex gap-8">
        {data.data.category.translations?.map((translation) => (
          <Card className="w-[600px]" key={translation.locale}>
            <CardHeader>
              <span className="font-light text-sm">Name</span>
              <CardTitle>{translation.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="font-light text-sm">Description</span>
              <p>{translation.description}</p>
            </CardContent>
            <CardFooter>
              <Button>Edit</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
