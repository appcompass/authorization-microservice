import { Transform } from 'class-transformer';
import { Moment } from 'moment';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { DateTransformer } from '../../db/transformers/date.transformer';
import { RolePermission } from './role-permission.entity';
import { Role } from './role.entity';
import { UserPermission } from './user-permission.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false
  })
  public name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public label: string;

  @Column({ type: 'text', nullable: false })
  public description: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  public system: boolean;

  @Transform((created) => created?.format() || null)
  @CreateDateColumn({ transformer: new DateTransformer() })
  createdAt: Moment;

  @Transform((updated) => updated?.format() || null)
  @UpdateDateColumn({ transformer: new DateTransformer() })
  updatedAt: Moment;

  @ManyToOne(() => Permission, (permission) => permission.assignablePermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignable_by_id' })
  public assignableBy: Permission;

  @OneToMany(() => Permission, (permission) => permission.assignableBy)
  public assignablePermissions: Permission[];

  @OneToMany(() => Role, (role) => role.assignableBy)
  public assignableRoles: Role[];

  @OneToMany(() => UserPermission, (userPermission) => userPermission.permission)
  public permissionToUsers: UserPermission[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
  public permissionToRoles: RolePermission[];
}
