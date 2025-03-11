import * as dotenv from 'dotenv';
dotenv.config();
export const mongoData = {
  mongoRemote: process.env.MONGO_URL,
  mongoLocal: 'mongodb://127.0.0.1:27017/test_api',
};
