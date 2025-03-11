import { EnvironmentVariable } from '../configuration';
import { IsString } from 'class-validator';

export class DatabaseSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}
  @IsString()
  mongoUri: string | undefined = this.environmentVariables.DB_URL;
}
