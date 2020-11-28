import { IsNotEmpty, IsNumber } from 'class-validator';

import { RolesExist } from '../validators/roles-exist.validator';

export class SyncUserRolesPayload {
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @RolesExist()
  readonly roleIds: number[];
}
