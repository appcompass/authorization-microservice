import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

import { Permission } from './permission.entity';
import { UserRole } from './user-role.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false
  })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  label: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  system: boolean;

  @ManyToOne(() => Permission, (permission) => permission.assignableRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignable_by_id' })
  assignableBy: Permission;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  roleToUsers: UserRole[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true
  })
  @JoinTable({
    name: 'role_permission',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id'
    }
  })
  permissions: Permission[];
}
