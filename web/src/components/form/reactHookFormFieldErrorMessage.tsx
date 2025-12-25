import { FormMessage, useFormField } from "../ui/form";

type FormFieldErrorMessageProps = {
  fieldErrors?: Map<string, string[]>;
};

/**
 * Must be used inside a shadcn form with react-hook-form!!!
 */
export function ReactHookFormFieldErrorMessage({
  fieldErrors,
}: FormFieldErrorMessageProps) {
  const { name: field } = useFormField();

  let message = "";
  if (
    fieldErrors !== undefined &&
    fieldErrors.has(field) &&
    fieldErrors.get(field)!.length > 0
  ) {
    message = fieldErrors.get(field)!.join(",");
  }

  if (!message) return <FormMessage />;
  return <p className="text-destructive text-sm">{message}</p>;
}
