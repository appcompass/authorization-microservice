import { Transform } from 'class-transformer';
import { Moment } from 'moment';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { DateTransformer } from '../../db/transformers/date.transformer';
import { AuditAuthAssignmentType } from '../api.types';

@Entity('audit_role_permission')
export class AuditRolePermission {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'integer', nullable: false, readonly: true })
  roleId: number;

  @Column({ type: 'integer', nullable: false, readonly: true })
  permissionId: number;

  @Column({ type: 'varchar', length: 12, nullable: false, readonly: true })
  changeType: AuditAuthAssignmentType;

  @Column({ type: 'integer', nullable: false, readonly: true })
  changeByUserId: number;

  @Transform(({ value }) => value?.format() || null)
  @CreateDateColumn({ transformer: new DateTransformer(), readonly: true })
  createdAt: Moment;
}