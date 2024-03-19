import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DataBaseService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async dropAllCollections(): Promise<void> {
    await this.connection.db.dropDatabase();
  }
}
