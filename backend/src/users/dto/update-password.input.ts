import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class UpdatePasswordInput {
  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @Field(() => String)
  currentPassword: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @MinLength(8, {
    message: i18nValidationMessage('validation.minLength'),
  })
  @MaxLength(512, {
    message: i18nValidationMessage('validation.maxLength'),
  })
  @Field(() => String)
  newPassword: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.required') })
  @MinLength(8, {
    message: i18nValidationMessage('validation.minLength'),
  })
  @MaxLength(512, {
    message: i18nValidationMessage('validation.maxLength'),
  })
  @ValidateIf(
    (o: UpdatePasswordInput) => o.newPassword !== o.confirmNewPassword,
    {
      message: i18nValidationMessage('validation.field.confirmPassword.match'),
    },
  )
  @Field(() => String)
  confirmNewPassword: string;
}
