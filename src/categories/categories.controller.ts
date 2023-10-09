import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Roles } from "../decorators/roles-auth.decorator";
import { RolesGuard } from "../guards/role.guard";
@ApiTags("Categories")
@Controller("categories")
@ApiBearerAuth()
@ApiHeader({
  name: "Authorization",
  description: "Bearer token",
})
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @ApiOperation({ summary: "Add Categories" })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: "Get all Categories" })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }
  @ApiOperation({ summary: "get Categories by name" })
  @Get(":name")
  findOne(@Param("name") name: string) {
    return this.categoriesService.findByName(name);
  }

  @ApiOperation({ summary: "Update Categories by id" })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @ApiOperation({ summary: "Remove Categories by ID" })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(+id);
  }
}
