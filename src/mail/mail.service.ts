import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { Customer } from "../customers/model/customer.model";
import { Admin } from "../admin/model/admin.model";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: Customer): Promise<void> {
    const url = `${process.env.api_host}/api/customers/activate${user.activation_link}`;
    console.log(url, " (Customer Activation)");
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Welcome to Magazine App! Confirm your email",
      template: "confirmation",
      context: {
        name: user.firstname,
        news: url,
      },
    });
  }
  async sendAdminConfirmation(user: Admin): Promise<void> {
    const url = `${process.env.api_host}/api/admin/activate${user.activation_link}`;
    console.log(url, " (Admin)");
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Welcome Admin! Confirm your email",
      template: "confirmation",
      context: {
        name: user.email,
        news: url,
      },
    });
  }
}
