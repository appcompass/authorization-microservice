import { IsNumber, IsOptional, IsString } from 'class-validator';

import { PermissionsExist } from '../validators/permissions-exist.validator';
import { RoleExists } from '../validators/role-exists.validator';

export class UpdateRolePayload {
  @RoleExists(false)
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly label: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsNumber()
  @IsOptional()
  readonly assignableById: number;

  @IsNumber({}, { each: true })
  @IsOptional()
  @PermissionsExist()
  readonly permissionIds: number[];
}
