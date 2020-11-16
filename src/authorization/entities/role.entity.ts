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
import { Permission } from './permission.entity';
import { RolePermission } from './role-permission.entity';
import { UserRole } from './user-role.entity';

@Entity('roles')
export class Role {
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

  @ManyToOne(() => Permission, (permission) => permission.assignableRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignable_by_id' })
  public assignableBy: Permission;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  public roleToUsers: UserRole[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  public roleToPermissions: RolePermission[];

  @Transform((created) => created?.format() || null)
  @CreateDateColumn({ transformer: new DateTransformer() })
  createdAt: Moment;

  @Transform((updated) => updated?.format() || null)
  @UpdateDateColumn({ transformer: new DateTransformer() })
  updatedAt: Moment;
}
