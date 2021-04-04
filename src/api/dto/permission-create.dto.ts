import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { PermissionExists } from '../validators/permission-exists.validator';

export class CreatePermissionPayload {
  @PermissionExists(false)
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly label: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNumber()
  @IsOptional()
  readonly assignableById: number;
}
