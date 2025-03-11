import * as dotenv from 'dotenv';
import * as process from 'process';
dotenv.config();
export const jwtConstants = {
  refreshTokenSecret: process.env.JWT_SECRET || '123',
  secret: process.env.SECRET || '123',
  accessTokenSecret: process.env.ACCESS_TOKEN || '123',
};
