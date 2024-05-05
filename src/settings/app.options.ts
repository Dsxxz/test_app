import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import { exceptionObjectType } from './types/exception.types';
import { HttpExceptionFilter } from './exception.filter';

export const appOptions = (app: INestApplication) => {
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorsForResp: exceptionObjectType[] = [];

        errors.forEach((err) => {
          if (err.constraints) {
            const keys = Object.keys(err.constraints);

            keys.forEach((k) => {
              errorsForResp.push({
                message: err.constraints![k],
                field: err.property,
              });
            });
          }
        });

        throw new BadRequestException(errorsForResp);
      },
    }),
  );
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
};
