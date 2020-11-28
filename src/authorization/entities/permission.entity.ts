import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => Permission, (permission) => permission.assignablePermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignable_by_id' })
  public assignableBy: Permission;

  @ManyToMany(() => Role, (role) => role.permissions)
  public roles: Role[];

  @OneToMany(() => Permission, (permission) => permission.assignableBy)
  public assignablePermissions: Permission[];

  @OneToMany(() => Role, (role) => role.assignableBy)
  public assignableRoles: Role[];

  @OneToMany(() => UserPermission, (userPermission) => userPermission.permission)
  public permissionToUsers: UserPermission[];
}
