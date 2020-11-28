import { Transform } from 'class-transformer';
import { Moment } from 'moment';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { DateTransformer } from '../../db/transformers/date.transformer';
import { AuditAuthAssignmentType } from '../authorization.types';

@Entity('audit_user_permission')
export class AuditUserPermission {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ readonly: true })
  public userId: number;

  @Column({ type: 'integer', nullable: false, readonly: true })
  permissionId: number;

  @Column({ type: 'varchar', length: 12, nullable: false, readonly: true })
  changeType: AuditAuthAssignmentType;

  @Column({ type: 'integer', nullable: false, readonly: true })
  changeByUserId: number;

  @Transform((created) => created?.format() || null)
  @CreateDateColumn({ transformer: new DateTransformer(), readonly: true })
  createdAt: Moment;
}
