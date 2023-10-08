import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsStrongPassword } from "class-validator";

export class LoginCustomerDto {
  @ApiProperty({ example: "tester@gmail.com", description: "Customer emaili" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "tester!!#$#3", description: "Customer password" })
  @IsStrongPassword()
  password: string;
}
