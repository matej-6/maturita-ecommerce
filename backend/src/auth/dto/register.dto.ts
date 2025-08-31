import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class RegisterDto {
  @MinLength(1, { message: 'Name is required' })
  @MaxLength(128, { message: 'Name must be less than 128 characters long' })
  firstName: string;

  @MinLength(1, { message: 'Last name is required' })
  @MaxLength(128, {
    message: 'Last name must be less than 128 characters long',
  })
  lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(256, { message: 'Email must be less than 256 characters long' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(512, {
    message: 'Password must be less than 512 characters long',
  })
  password: string;

  @IsNotEmpty({ message: 'Confirm password is required' })
  @MinLength(8, {
    message: 'Confirm password must be at least 8 characters long',
  })
  @MaxLength(512, {
    message: 'Confirm password must be less than 512 characters long',
  })
  @ValidateIf((o: RegisterDto) => o.password === o.confirmPassword, {
    message: 'Passwords do not match',
  })
  confirmPassword: string;
}
