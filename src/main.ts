import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
    CallHandler,
    ExecutionContext,
    NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { LoggingInterceptor } from 'common/logging.interceptor';

function shiftDates(d: any): any {
  if (d instanceof Date) return new Date(d.getTime() + 2*3600*1000);
  if (Array.isArray(d)) return d.map(shiftDates);
  if (d && typeof d === 'object')
    return Object.fromEntries(Object.entries(d).map(([k, v]) => [k, shiftDates(v)]));
  return d;
}

class Tz2Interceptor {
  intercept(_: any, next: any) {
    return next.handle().pipe(map(shiftDates));
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.DailyRotateFile({
          dirname: 'logs',
          filename: 'app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'info',
          maxFiles: '15d',
          auditFile: 'logs/rotate.json',
          zippedArchive: true,
        }),
        new winston.transports.DailyRotateFile({
          dirname: 'logs',
          filename: 'app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxFiles: '30d',
          auditFile: 'logs/rotate.json',
          zippedArchive: true,
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
      ],
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
      ),
    }),
  });

  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('nestjs-postgresql API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  document.security = [{ bearer: [] }];
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: -1,
    },
  });
  app.useGlobalInterceptors(new Tz2Interceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
