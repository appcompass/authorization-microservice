import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

import { PermissionsExist } from '../validators/permissions-exist.validator';

export class PermissionIdsPayload {
  @IsDefined()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @PermissionsExist()
  readonly permissionIds: number[];
}
