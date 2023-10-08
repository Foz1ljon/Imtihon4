import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FindAdminDto {
  @ApiProperty({ example: "admin", description: "admin username" })
  @IsOptional()
  username?: string;
  @ApiProperty({ example: "admin@example.com", description: "admin email" })
  @IsOptional()
  email?: string;
}
