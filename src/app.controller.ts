import { Controller, Delete, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DataBaseService } from './dbService/data.base.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataBaseService: DataBaseService,
  ) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
  @Delete('testing/all-data')
  async deleteAll() {
    await this.dataBaseService.clearAllCollections();
    return;
  }
}
