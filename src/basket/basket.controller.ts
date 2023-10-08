import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  Put,
  Res,
} from "@nestjs/common";
import { BasketService } from "./basket.service";
import { CreateBasketDto } from "./dto/create-basket.dto";
import { UpdateBasketDto } from "./dto/update-basket.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CustomerGuard } from "../guards/Auth.guard";
import { CookieGetter } from "../decorators/cookieGetter.decorator";
@ApiTags("basketS")
@Controller("basket")
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @ApiOperation({ summary: "add basket" })
  @UseGuards(CustomerGuard)
  @Post()
  create(
    @Body() createBasketDto: CreateBasketDto,
    @CookieGetter("refresh_token") refreshToken: string,
  ) {
    return this.basketService.create(createBasketDto, refreshToken);
  }

  @UseGuards(CustomerGuard)
  @ApiOperation({ summary: "get all basket" })
  @Get()
  findAll(@CookieGetter("refresh_token") refreshToken: string) {
    return this.basketService.findAll(refreshToken);
  }

  @UseGuards(CustomerGuard)
  @ApiOperation({ summary: "get basket by ID" })
  @Get(":id")
  findOne(
    @Param("id") id: string,
    @CookieGetter("refresh_token") refreshToken: string,
  ) {
    return this.basketService.findById(+id, refreshToken);
  }

  @UseGuards(CustomerGuard)
  @ApiOperation({ summary: "update basket by ID" })
  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updateBasketDto: UpdateBasketDto,
    @CookieGetter("refresh_token") refreshToken: string,
  ) {
    return this.basketService.update(+id, updateBasketDto, refreshToken);
  }

  @UseGuards(CustomerGuard)
  @ApiOperation({ summary: "remove basket by ID" })
  @Delete(":id")
  remove(
    @Param("id") id: string,
    @CookieGetter("refresh_token") refreshToken: string,
  ) {
    return this.basketService.remove(+id, refreshToken);
  }
}
