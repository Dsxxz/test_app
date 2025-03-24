import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';
import { AppModule } from '../../src/app.module';
import { DataBaseService } from '../../src/dbService/data.base.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AppService, DataBaseService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root',   () => {
    it('should return "Hello World!"', async ()  => {
      const result =  appController.getHello();
      expect(result).toBe('Hello World!');    });
  });
});

