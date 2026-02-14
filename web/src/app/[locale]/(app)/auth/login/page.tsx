import { getCurrentSessionAction } from "@/app/data-access-layer/auth/actions";
import LoginForm from "@/components/form/login-form";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function LoginPage() {
  const session = await getCurrentSessionAction();

  if (session) {
    const locale = await getLocale();
    redirect({ href: "/", locale });
  }

  return <LoginForm />;
}
