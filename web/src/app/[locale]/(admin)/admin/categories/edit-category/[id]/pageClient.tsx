"use client";

import { getEditCategoryQueryDocumentData } from "@/app/data-access-layer/admin/category/queries";
import { handleGraphqlError } from "@/app/data-access-layer/admin/handleGraphqlFormError";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link, useRouter } from "@/i18n/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircleIcon, ArrowUpRight } from "lucide-react";
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

  const missingTranslations = data.data.locales.filter(
    (l) => !data.data?.category.translations?.some((t) => t.locale === l.code)
  );

  return (
    <div className="bg-muted/50 dark:bg-muted/50 flex flex-col flex-1 rounded-xl p-6 gap-y-10">
      <div className="flex flex-col gap-y-8">
        <h1 className="text-4xl">Overview</h1>
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
        <div className="grid grid-cols-3 gap-6 w-4xl">
          <div className="flex flex-col gap-y-0">
            <span className="text-muted-foreground text-sm">Slug</span>
            <p className="text-lg">{data.data.category.slug}</p>
          </div>
          <div className="flex flex-col gap-y-0">
            <span className="text-muted-foreground text-sm">
              Parent Category
            </span>
            <p className="text-lg">
              {data.data.category.parentCategoryId ? (
                <Link
                  className="hover:underline"
                  href={`/admin/categories/edit-category/${data.data.category.parentCategoryId}`}
                >
                  {data.data.category.parentCategoryId}
                </Link>
              ) : (
                "None"
              )}
            </p>
          </div>
          <div className="flex flex-col gap-y-0">
            <span className="text-muted-foreground text-sm">
              Nu. of subcategories
            </span>
            <p className="text-lg">{data.data.category.subcategories.length}</p>
          </div>
          <div className="flex flex-col gap-y-0">
            <span className="text-muted-foreground text-sm">
              Nu. of products
            </span>
            <p className="text-lg">{0}</p>
          </div>
          <div className="flex flex-col gap-y-0">
            <span className="text-muted-foreground text-sm">Is Public</span>
            <p className="text-lg">
              {data.data.category.isPublic ? "Yes" : "No"}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-start gap-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-fit">Edit category</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit category</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 px-4">
                  <EditCategoryForm
                    refetchQueryKey={["category", id]}
                    categoriesQuery={data}
                    categoryId={id}
                    data={{
                      slug: data.data.category.slug,
                      parentCategoryId:
                        data.data.category.parentCategoryId || "",
                    }}
                  />
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="outline">Close</Button>
                  </SheetClose>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
          <Link href={`/category/${data.data.category.slug}`}>
            {" "}
            <Button className="group gap-x-0.5" variant={"link"}>
              <span>View page</span>
              <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-100" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="h-px w-full bg-muted-foreground/30 rounded-full" />
      <div className="space-y-6">
        <h2 className="text-3xl">Category translations</h2>
        <Button disabled={missingTranslations.length === 0}>
          Add Translation
        </Button>

        <div className="flex gap-8">
          {data.data.category.translations?.map((translation) => {
            const locale = data.data?.locales.find(
              (l) => l.code === translation.locale
            );

            return (
              <Card className="w-lg" key={translation.locale}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {locale
                      ? `${locale?.name} ${locale?.flag}`
                      : translation.locale}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 flex-auto">
                  <div>
                    <span className="text-muted-foreground text-sm">Name</span>
                    <p>{translation.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">
                      Description
                    </span>
                    <p>{translation.description}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-x-2 justify-center">
                    <Button>Edit</Button>
                    <Button variant={"secondary"}>Delete</Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
