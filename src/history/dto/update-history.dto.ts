import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString } from "class-validator";

export class UpdateHistoryDto {
  @ApiProperty({ example: "1", description: "Purchase ID" })
  @IsOptional()
  @IsNumberString()
  purchase_id: number;

  @ApiProperty({ example: "19999", description: "payment Summa" })
  @IsOptional()
  @IsNumberString()
  payment: number;

  @ApiProperty({ example: "[cash, card]", description: "payment type" })
  @IsOptional()
  @IsString()
  pay_type: string;
}
