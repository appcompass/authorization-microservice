import { IsNumber } from 'class-validator';

export class IdResponse {
  @IsNumber()
  id: number;
}
