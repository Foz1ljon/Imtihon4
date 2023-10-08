import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePurchaseDto } from "./dto/create-purchase.dto";
import { UpdatePurchaseDto } from "./dto/update-purchase.dto";
import { Customer } from "../customers/model/customer.model";
import { InjectModel } from "@nestjs/sequelize";
import { Purchase } from "./models/purchase.model";
import { Product } from "../product/model/product.model";
import { StatusTrueDto } from "./dto/status-purchase.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel(Purchase) private readonly purchaseRepo: typeof Purchase,
    private readonly jwtService: JwtService,
  ) {}
  async create(createPurchaseDto: CreatePurchaseDto, refreshToken: string) {
    const req = this.jwtService.decode(refreshToken);

    const customerId = await Customer.findByPk(createPurchaseDto.customer_id);
    const productId = await Product.findByPk(createPurchaseDto.product_id);
    if (!customerId || !productId)
      throw new NotFoundException("Customer or Product not found");
    createPurchaseDto.admin_id = req["id"];
    let price = productId.price;
    /* Calculate total Amount */
    createPurchaseDto.total_amount =
      price + (price / 100) * createPurchaseDto.interest_rate;
    /* Calculate Payment In Month */
    createPurchaseDto.paymentMonth =
      createPurchaseDto.total_amount / createPurchaseDto.installmentDuration;
    this.purchaseRepo.create(createPurchaseDto);
  }

  findAll() {
    return this.purchaseRepo.findAll({ include: { all: true } });
  }

  findById(id: number) {
    return this.purchaseRepo.findByPk(id);
  }

  async update(
    id: number,
    updatePurchaseDto: UpdatePurchaseDto,
    refreshToken: string,
  ) {
    const req = this.jwtService.decode(refreshToken);

    updatePurchaseDto.admin_id = req["id"];
    const data = await this.purchaseRepo.update(updatePurchaseDto, {
      where: { id },
      returning: true,
    });
    return data[1][0];
  }

  async remove(id: number, statusTrueDto: StatusTrueDto) {
    const data = await this.purchaseRepo.update(statusTrueDto, {
      where: { id },
      returning: true,
    });
    return data[1][0];
  }
}
