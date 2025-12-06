import { registerDecorator, ValidationOptions } from 'class-validator';

export function ContainsTranslation(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'containsTranslation',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value, args) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const [locale] = args ? args.constraints : ['en'];
          return (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            Array.isArray(value) && value.some((t) => t.localeCode === locale)
          );
        },
      },
    });
  };
}
