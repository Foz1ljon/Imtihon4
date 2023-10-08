import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { FindProductDto } from "./dto/find-product.dt";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminGuard } from "../guards/Auth.guard";
@ApiTags("Products")
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @ApiOperation({ summary: "Create a new Product" })
  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor("image"))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image: any,
  ) {
    return this.productService.create(createProductDto, image);
  }

  @ApiOperation({ summary: "find product  Product" })
  @Post("find")
  findAll(@Body() findProductDto: FindProductDto) {
    return this.productService.findAll(findProductDto);
  }

  @ApiOperation({ summary: "Get Product by ID" })
  @Get(":id")
  findByID(@Param("id") id: string) {
    return this.productService.findById(+id);
  }

  @ApiOperation({ summary: "Update Product by ID" })
  @UseGuards(AdminGuard)
  @Put(":id")
  @UseInterceptors(FileInterceptor("image"))
  update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() image: any,
  ) {
    return this.productService.update(+id, updateProductDto, image);
  }

  @ApiOperation({ summary: "Remove Product by ID" })
  @UseGuards(AdminGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.productService.remove(+id);
  }
}
