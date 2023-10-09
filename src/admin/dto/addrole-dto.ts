import { IsEmpty, IsNumber, IsNumberString, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddRoleDto {
  @ApiProperty({ example: "2", description: "Admin ID" })
  @IsNumberString()
  readonly admin_id: number;

  @ApiProperty({ example: "USER", description: "Admin Level" })
  @IsString()
  readonly value: string;
}
