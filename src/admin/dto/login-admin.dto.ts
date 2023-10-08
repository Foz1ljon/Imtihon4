import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsStrongPassword } from "class-validator";

export class LoginAdminDto {
  @ApiProperty({ example: "admin@example.com", description: "admin email" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "admi#!F::", description: "admin password" })
  @IsStrongPassword({ minLength: 6 })
  password: string;
}
