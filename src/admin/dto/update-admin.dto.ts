import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateAdminDto } from "./create-admin.dto";
import {
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  IsStrongPassword,
} from "class-validator";

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @ApiProperty({ example: "admin", description: "admin username" })
  @IsOptional()
  @IsAlphanumeric()
  username: string;
  @ApiProperty({ example: "admin@example.com", description: "admin email" })
  @IsOptional()
  @IsEmail()
  email: string;
  @ApiProperty({ example: "adminA!Ecs::", description: "admin password" })
  @IsOptional()
  @IsStrongPassword()
  password: string;
}
