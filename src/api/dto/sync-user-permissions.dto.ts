import { IsNotEmpty, IsNumber } from 'class-validator';

import { PermissionsExist } from '../validators/permissions-exist.validator';

export class SyncUserPermissionsPayload {
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @PermissionsExist()
  readonly permissionIds: number[];
}
