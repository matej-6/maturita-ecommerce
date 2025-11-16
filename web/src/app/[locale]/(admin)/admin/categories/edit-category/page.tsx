import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function EditCategoryPage() {
  const locale = await getLocale();
  return redirect({ href: "/admin/categories", locale: locale });
}
