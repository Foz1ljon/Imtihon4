import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Role } from "./models/role.models";

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role) private roleRepo: typeof Role) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const data = await this.roleRepo.findOne({
      where: { value: createRoleDto.value },
    });
    if (data) throw new BadRequestException("Role is existing");
    return this.roleRepo.create(createRoleDto);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepo.findAll();
  }

  async findByValue(value: string): Promise<Role> {
    return this.roleRepo.findOne({ where: { value } });
  }
}
