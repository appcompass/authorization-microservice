import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { Permission } from './permission.entity';

@Entity('user_permission')
export class UserPermission {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  permissionId: number;

  @ManyToOne(() => Permission, (permission) => permission.permissionToUsers, { onDelete: 'CASCADE' })
  permission!: Permission;
}
