import { Transform } from 'class-transformer';
import { Moment } from 'moment';
import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { DateTransformer } from '../../db/transformers/date.transformer';
import { Permission } from './permission.entity';
import { Role } from './role.entity';

@Entity('role_permission')
export class RolePermission {
  @PrimaryColumn()
  public roleId: number;

  @PrimaryColumn()
  public permissionId: number;

  @Transform((created) => created?.format() || null)
  @CreateDateColumn({ transformer: new DateTransformer() })
  createdAt: Moment;

  @Transform((updated) => updated?.format() || null)
  @UpdateDateColumn({ transformer: new DateTransformer() })
  updatedAt: Moment;

  @ManyToOne(() => Role, (role) => role.roleToPermissions, { onDelete: 'CASCADE' })
  public role!: Role;

  @ManyToOne(() => Permission, (permission) => permission.permissionToRoles, { onDelete: 'CASCADE' })
  public permission!: Permission;
}
