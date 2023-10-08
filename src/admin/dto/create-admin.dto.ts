import { ApiProperty } from "@nestjs/swagger";
import {
  IsAlphanumeric,
  IsEmail,
  IsStrongPassword,
  isAlphanumeric,
} from "class-validator";

export class CreateAdminDto {
  @ApiProperty({ example: "adminchik", description: "admin username" })
  @IsAlphanumeric()
  username: string;

  @ApiProperty({ example: "admin@gmail.com", description: "admin email" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Qwe$#ac", description: "admin password" })
  @IsStrongPassword()
  password: string;

  @ApiProperty({ example: "Qwe$#ac", description: "repeat admin password" })
  @IsStrongPassword()
  confirm_password: string;
}
