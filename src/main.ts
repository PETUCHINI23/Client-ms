import { NestFactory } from '@nestjs/core';
import { Logger, ValidationError, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, RpcException, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Clients-MS');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    { transport: Transport.TCP, options: { port: envs.port } },
  );
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      // En un microservicio los errores deben viajar como RpcException
      exceptionFactory: (errors: ValidationError[]) =>
        new RpcException({
          status: 400,
          message: errors.flatMap((e) => Object.values(e.constraints ?? {})),
        }),
    }),
  );
  await app.listen();
  logger.log(`Clients microservice running on port ${envs.port}`);
}
bootstrap();
