import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { RoleExists } from '../validators/role-exists.validator';

export class CreateRolePayload {
  @RoleExists(false)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly label: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  readonly assignableById: number;
}
