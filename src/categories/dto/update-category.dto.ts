import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsNotEmpty } from "class-validator";

export class UpdateCategoryDto {
  @ApiProperty({ example: "Telephones", description: "Category name" })
  @IsAlpha()
  @IsNotEmpty()
  name: string;
}
