import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RegisterDto {
  @MinLength(1, { message: i18nValidationMessage('validation.required') })
  @MaxLength(128, { message: i18nValidationMessage('validation.maxLength') })
  firstName: string;

  @IsString({ message: i18nValidationMessage('validation.required') })
  @MinLength(1, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(128, {
    message: 'Last name must be less than 128 characters long',
  })
  lastName: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @IsEmail(undefined, { message: i18nValidationMessage('validation.invalid') })
  @MaxLength(256, { message: i18nValidationMessage('validation.maxLength') })
  email: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @MinLength(8, { message: i18nValidationMessage('validation.minLength') })
  @MaxLength(512, {
    message: i18nValidationMessage('validation.maxLength'),
  })
  password: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @MinLength(8, {
    message: i18nValidationMessage('validation.minLength'),
  })
  @MaxLength(512, {
    message: i18nValidationMessage('validation.maxLength'),
  })
  @ValidateIf((o: RegisterDto) => o.password === o.confirmPassword, {
    message: i18nValidationMessage('validation.field.confirmPassword.match'),
  })
  confirmPassword: string;
}
