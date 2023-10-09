import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUppercase, IsString } from "class-validator";

export class CreateRoleDto {
  @ApiProperty({ example: "USER", description: "Rol nomi" })
  @IsNotEmpty()
  @IsUppercase()
  @IsString()
  value: string;
  @ApiProperty({ example: "Bu user roli", description: "Rol haqida malumot" })
  @IsNotEmpty()
  @IsString()
  description: string;
}
