import * as dotenv from 'dotenv';
import * as process from 'process';
dotenv.config();
export const mailData = {
  email: 'dsxxz92@gmail.com',
  pass: process.env.EMAIL_PASSWORD,
};
