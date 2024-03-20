import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DataBaseService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async clearAllCollections(): Promise<void> {
    const collections = await this.connection.db.listCollections().toArray();

    for (const collection of collections) {
      const colName = collection.name;
      await this.connection.db.collection(colName).deleteMany({});
    }
  }
}
