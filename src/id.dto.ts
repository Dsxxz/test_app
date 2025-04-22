import { IsNotEmpty, IsString } from "class-validator";

export class IdDto {
  @IsString({ message: 'ID must be a string' })
  @IsNotEmpty({ message: 'ID should not be empty' })
  id: string;
}
//do idDto for all conrtrollers