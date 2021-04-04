import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetUserPermissionNamesPayload {
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;
}
