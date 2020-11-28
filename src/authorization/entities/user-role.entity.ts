import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { Role } from './role.entity';

@Entity('user_role')
export class UserRole {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  public roleId: number;

  @ManyToOne(() => Role, (role) => role.roleToUsers, { onDelete: 'CASCADE' })
  role!: Role;
}
