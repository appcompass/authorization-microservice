import { Transform } from 'class-transformer';
import { Moment } from 'moment';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { DateTransformer } from '../../db/transformers/date.transformer';
import { AuditDataChangeType } from '../authorization.types';
import { Role } from './role.entity';

@Entity('audit_role')
export class AuditRole {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'integer', nullable: false, readonly: true })
  roleId: number;

  @Column({ type: 'varchar', length: 12, nullable: false, readonly: true })
  changeType: AuditDataChangeType;

  @Column({ type: 'integer', nullable: false, readonly: true })
  changeByUserId: number;

  @Column({ type: 'jsonb', nullable: true, readonly: true })
  originalData: Role;

  @Column({ type: 'jsonb', nullable: true, readonly: true })
  newData: Role;

  @Transform(({ value }) => value?.format() || null)
  @CreateDateColumn({ transformer: new DateTransformer(), readonly: true })
  createdAt: Moment;
}
