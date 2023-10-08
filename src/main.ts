import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";

const start = async () => {
  try {
    const app = await NestFactory.create(AppModule);
    let port = process.env.port || 4000;
    app.useGlobalPipes(new ValidationPipe());

    app.setGlobalPrefix("api");

    const config = new DocumentBuilder()
      .setTitle("Online Magazine Project")
      .setDescription("REST API")
      .setVersion("1.0.0")
      .addTag("NestJS, PostgreSQL, Sequelize")
      .addOAuth2()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/api/docs", app, document);
    app.use(cookieParser());
    await app.listen(port, () => {
      console.log("Running on " + port);
    });
  } catch (error) {
    console.log(error.message);
  }
};

start();
