import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserIdPayload {
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;
}
