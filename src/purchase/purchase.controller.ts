import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from "@nestjs/common";
import { PurchaseService } from "./purchase.service";
import { CreatePurchaseDto } from "./dto/create-purchase.dto";
import { UpdatePurchaseDto } from "./dto/update-purchase.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { StatusTrueDto } from "./dto/status-purchase.dto";
import { AdminGuard } from "../guards/Auth.guard";
import { CookieGetter } from "../decorators/cookieGetter.decorator";
@ApiTags("Purchases")
@Controller("purchase")
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}
  @ApiOperation({ summary: "Add purchase" })
  @UseGuards(AdminGuard)
  @Post()
  create(
    @Body() createPurchaseDto: CreatePurchaseDto,
    @CookieGetter("refresh_token") refreshToken: string,
  ) {
    return this.purchaseService.create(createPurchaseDto, refreshToken);
  }
  @ApiOperation({ summary: "Add purchase" })
  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.purchaseService.findAll();
  }
  @ApiOperation({ summary: "Get purchase by ID" })
  @UseGuards(AdminGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.purchaseService.findById(+id);
  }

  @ApiOperation({ summary: "Update purchase by ID" })
  @UseGuards(AdminGuard)
  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
    @CookieGetter("refresh_token") refreshToken: string,
  ) {
    return this.purchaseService.update(+id, updatePurchaseDto, refreshToken);
  }

  @ApiOperation({ summary: "Deactive purchase by ID" })
  @UseGuards(AdminGuard)
  @Delete(":id")
  remove(@Param("id") id: string, statusTrueDto: StatusTrueDto) {
    return this.purchaseService.remove(+id, statusTrueDto);
  }
}
