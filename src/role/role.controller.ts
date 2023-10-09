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
import { RoleService } from "./role.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { CreatorGuard } from "../guards/creator.guard";
@ApiTags("Rollar")
@Controller("role")
@ApiBearerAuth()
@ApiHeader({
  name: "Authorization",
  description: "Bearer token",
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @ApiOperation({ summary: "Role yaratish" })
  @Post()
  @UseGuards(CreatorGuard)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }
  @ApiOperation({ summary: "Rollar korish" })
  @UseGuards(CreatorGuard)
  @Get()
  findAll() {
    return this.roleService.findAll();
  }
  @ApiOperation({ summary: "Rolni nomi boyicha olish" })
  @UseGuards(CreatorGuard)
  @Get(":value")
  findOne(@Param("value") value: string) {
    return this.roleService.findByValue(value);
  }
}
