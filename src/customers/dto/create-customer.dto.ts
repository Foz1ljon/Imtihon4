import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsEmail,
  IsPhoneNumber,
  IsStrongPassword,
  IsOptional,
} from "class-validator";

export class CreateCustomerDto {
  @ApiProperty({ example: "Shokirjon", description: "Customer Name" })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ example: "Zokirov", description: "Customer SurName" })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ example: "default.jpg", description: "Customer photo" })
  @IsOptional()
  @IsString()
  photo: string;

  @ApiProperty({ example: "2000-09-09", description: "Customer birthdate" })
  // @IsDate()
  birthdate: Date;

  @ApiProperty({ example: "AB 1234567", description: "Customer passport" })
  @IsString()
  @IsNotEmpty()
  passport: string;

  @ApiProperty({
    example: "Toshkent, Bunyodkor street 44",
    description: "Customer Address",
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: "@Zokirov666@gmail.com",
    description: "Customer email",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "+998901234567",
    description: "Customer phoneNumber",
  })
  @IsPhoneNumber("UZ")
  phone: string;

  @ApiProperty({ example: "Qwer!y22", description: "Customer password" })
  @IsStrongPassword({ minLength: 6 })
  password: string;
  @ApiProperty({ example: "Qwer!y22", description: "Customer repeat password" })
  confirm_password: string;
}
