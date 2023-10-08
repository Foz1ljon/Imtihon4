import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Category } from "./models/category.model";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private readonly categoryRepo: typeof Category,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepo.create(createCategoryDto);
  }

  findAll() {
    return this.categoryRepo.findAll({ include: { all: true } });
  }

  findByName(name: string) {
    return this.categoryRepo.findOne({
      where: { name },
      include: { all: true },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const data = this.categoryRepo.update(updateCategoryDto, {
      where: { id },
      returning: true,
    });

    return data
  }

  remove(id: number) {
    return this.categoryRepo.destroy({ where: { id } });
  }
}
