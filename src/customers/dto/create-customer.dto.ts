import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @Length(3, 80)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @Matches(/^\d{10}$/, { message: 'phone must be exactly 10 numeric digits' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  address?: string;
}
