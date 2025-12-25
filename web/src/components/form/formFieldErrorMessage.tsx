export function FormFieldErrorMessage({
  fieldErrors,
  fieldName,
}: {
  fieldErrors?: Map<string, string[]>;
  fieldName: string;
}) {
  let message = "";
  if (
    fieldErrors !== undefined &&
    fieldErrors.has(fieldName) &&
    fieldErrors.get(fieldName)!.length > 0
  ) {
    message = fieldErrors.get(fieldName)!.join(",");
  }

  return <p className="text-destructive text-sm">{message}</p>;
}
