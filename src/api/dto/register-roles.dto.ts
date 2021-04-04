import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { RoleExists } from '../validators/role-exists.validator';
import { CreatePermissionPayload } from './permission-create.dto';

export class RegisterRolesPayload {
  @RoleExists(false)
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

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePermissionPayload)
  readonly permissions: CreatePermissionPayload[];
}
