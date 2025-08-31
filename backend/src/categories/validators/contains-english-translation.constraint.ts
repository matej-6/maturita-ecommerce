import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class ContainsEnglishTranslationConstraint
  implements ValidatorConstraintInterface
{
  validate(
    translations: { localeCode: string }[],
    validationArguments?: ValidationArguments,
  ): boolean {
    if (!Array.isArray(translations)) return false;
    return translations.some((t) => t.localeCode === 'en');
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'An English translation is required.';
  }
}

export function ContainsEnglishTranslation(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ContainsEnglishTranslationConstraint,
    });
  };
}
