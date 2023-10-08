import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Product } from "./model/product.model";
import { FilesService } from "../files/files.service";
import { FindProductDto } from "./dto/find-product.dt";
import { Op } from "sequelize";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private productRepo: typeof Product,
    private readonly fileService: FilesService,
  ) {}
  async create(createProductDto: CreateProductDto, image: any) {
    if (!image) throw new BadRequestException("Photo is requirred");
    const fileName = await this.fileService.createFile(image);

    createProductDto.photo = fileName;
    const post = await this.productRepo.create({
      ...createProductDto,
    });

    return post;
  }

  async findAll(findProductDto: FindProductDto) {
    try {
      const where = {};

      const { title, description } = findProductDto;

      if (title) {
        where["title"] = {
          [Op.like]: `%${title}%`,
        };
      }
      if (description) {
        where["description"] = {
          [Op.like]: `%${description}%`,
        };
      }

      if (findProductDto.price_begin && findProductDto.price_end) {
        where[Op.and] = {
          birthday: {
            [Op.between]: [
              findProductDto.price_begin,
              findProductDto.price_end,
            ],
          },
        };
      } else if (findProductDto.price_begin) {
        where["birthday"] = {
          [Op.gte]: [findProductDto.price_begin],
        };
      } else if (findProductDto.price_end) {
        where["birthday"] = {
          [Op.gte]: [findProductDto.price_end],
        };
      }

      const products = await Product.findAll({ where });

      if (!products) throw new BadRequestException("Product not found");
      return products;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findById(id: number) {
    return this.productRepo.findByPk(id);
  }

  async update(id: number, updateProductDto: UpdateProductDto, image: any) {
    const fileName = await this.fileService.createFile(image);
    updateProductDto.photo = fileName;
    const data = await this.productRepo.update(updateProductDto, {
      where: { id },
      returning: true,
    });

    return data[1][0];
  }

  remove(id: number) {
    return this.productRepo.destroy({ where: { id } });
  }
}
