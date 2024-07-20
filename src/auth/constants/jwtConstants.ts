import * as dotenv from 'dotenv';
dotenv.config();
export const jwtConstants = {
  refreshTokenSecret: process.env.JWT_SECRET || '123',
  secret: process.env.SECRET || '123',
};
