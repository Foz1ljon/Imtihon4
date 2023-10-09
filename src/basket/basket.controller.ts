import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  Put,
} from "@nestjs/common";
import { BasketService } from "./basket.service";
import { CreateBasketDto } from "./dto/create-basket.dto";
import { UpdateBasketDto } from "./dto/update-basket.dto";
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { CustomerGuard } from "../guards/Auth.guard";
import { CookieGetter } from "../decorators/cookieGetter.decorator";
@ApiTags("basketS")
@Controller("basket")
@ApiBearerAuth()
@ApiHeader({
  name: "Authorization",
  description: "Bearer token",
})
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

  @ApiOperation({ summary: "get all basket" })
  @UseGuards(CustomerGuard)
  @Get()
  findAll(@CookieGetter("refresh_token") refreshToken: string) {
    return this.basketService.findAll(refreshToken);
  }

  @ApiOperation({ summary: "get basket by ID" })
  @UseGuards(CustomerGuard)
  @Get(":id")
  findOne(
    @Param("id") id: string,
    @CookieGetter("refresh_token") refreshToken: string,
  ) {
    return this.basketService.findById(+id, refreshToken);
  }

  @ApiOperation({ summary: "update basket by ID" })
  @UseGuards(CustomerGuard)
  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updateBasketDto: UpdateBasketDto,
    @CookieGetter("refresh_token") refreshToken: string,
  ) {
    return this.basketService.update(+id, updateBasketDto, refreshToken);
  }

  @ApiOperation({ summary: "remove basket by ID" })
  @UseGuards(CustomerGuard)
  @Delete(":id")
  remove(
    @Param("id") id: string,
    @CookieGetter("refresh_token") refreshToken: string,
  ) {
    return this.basketService.remove(+id, refreshToken);
  }
}
