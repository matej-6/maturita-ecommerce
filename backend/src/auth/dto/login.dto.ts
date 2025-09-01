import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @IsEmail(undefined, { message: i18nValidationMessage('validation.invalid') })
  email: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @MaxLength(512, {
    message: i18nValidationMessage('validation.maxLength'),
  })
  password: string;
}
