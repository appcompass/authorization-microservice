import { Transform } from 'class-transformer';
import { Moment } from 'moment';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { DateTransformer } from '../../db/transformers/date.transformer';
import { AuditDataChangeType } from '../authorization.types';
import { Permission } from './permission.entity';

@Entity('audit_permission')
export class AuditPermission {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'integer', nullable: false, readonly: true })
  permissionId: number;

  @Column({ type: 'varchar', length: 12, nullable: false, readonly: true })
  changeType: AuditDataChangeType;

  @Column({ type: 'integer', nullable: false, readonly: true })
  changeByUserId: number;

  @Column({ type: 'jsonb', nullable: true, readonly: true })
  originalData: Permission;

  @Column({ type: 'jsonb', nullable: true, readonly: true })
  newData: Permission;

  @Transform((created) => created?.format() || null)
  @CreateDateColumn({ transformer: new DateTransformer(), readonly: true })
  createdAt: Moment;
}
