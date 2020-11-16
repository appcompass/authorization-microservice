import { Transform } from 'class-transformer';
import { Moment } from 'moment';
import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { DateTransformer } from '../../db/transformers/date.transformer';
import { Permission } from './permission.entity';

@Entity('user_permission')
export class UserPermission {
  @PrimaryColumn()
  public userId: number;

  @PrimaryColumn()
  public permissionId: number;

  @Transform((created) => created?.format() || null)
  @CreateDateColumn({ transformer: new DateTransformer() })
  createdAt: Moment;

  @Transform((updated) => updated?.format() || null)
  @UpdateDateColumn({ transformer: new DateTransformer() })
  updatedAt: Moment;

  @ManyToOne(() => Permission, (permission) => permission.permissionToUsers, { onDelete: 'CASCADE' })
  public permission!: Permission;
}
