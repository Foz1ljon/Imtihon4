import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsDate,
  IsEmail,
  IsPhoneNumber,
  IsStrongPassword,
  IsOptional,
} from "class-validator";

export class UpdateCustomerDto {
  @ApiProperty({ example: "Shokirjon", description: "Customer Name" })
  @IsOptional()
  @IsString()
  firstname: string;

  @ApiProperty({ example: "Zokirov", description: "Customer SurName" })
  @IsOptional()
  @IsString()
  lastname: string;

  @ApiProperty({ example: "default.jpg", description: "Customer photo" })
  @IsOptional()
  @IsString()
  photo: string;

  @ApiProperty({ example: "2000-09-09", description: "Customer birthdate" })
  @IsOptional()
  @IsDate()
  birthdate: Date;

  @ApiProperty({ example: "AB 1234567", description: "Customer passport" })
  @IsOptional()
  @IsString()
  passport: string;

  @ApiProperty({
    example: "Toshkent, Bunyodkor street 44",
    description: "Customer Address",
  })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({
    example: "@Zokirov666@gmail.com",
    description: "Customer email",
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "+998901234567",
    description: "Customer phoneNumber",
  })
  @IsOptional()
  @IsPhoneNumber("UZ")
  phone: string;

  @ApiProperty({ example: "Qwer!y22", description: "Customer password" })
  @IsStrongPassword({ minLength: 6 })
  @IsOptional()
  password: string;
}
