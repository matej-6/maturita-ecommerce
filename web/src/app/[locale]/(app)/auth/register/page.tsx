import { getCurrentSessionAction } from "@/app/data-access-layer/auth/actions";
import RegisterForm from "@/components/form/register-form";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function RegisterPage() {
  const session = await getCurrentSessionAction();

  if (session) {
    const locale = await getLocale();
    redirect({ href: "/", locale });
  }

  return <RegisterForm />;
}
