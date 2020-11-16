import { Transform } from 'class-transformer';
import { Moment } from 'moment';
import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { DateTransformer } from '../../db/transformers/date.transformer';
import { Role } from './role.entity';

@Entity('user_role')
export class UserRole {
  @PrimaryColumn()
  public userId: number;

  @PrimaryColumn()
  public roleId: number;

  @Transform((created) => created?.format() || null)
  @CreateDateColumn({ transformer: new DateTransformer() })
  createdAt: Moment;

  @Transform((updated) => updated?.format() || null)
  @UpdateDateColumn({ transformer: new DateTransformer() })
  updatedAt: Moment;

  @ManyToOne(() => Role, (role) => role.roleToUsers, { onDelete: 'CASCADE' })
  public role!: Role;
}
