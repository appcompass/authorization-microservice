import { Request } from 'express';
import { OrderByCondition } from 'typeorm';

export interface UserRecord {
  id: number;
  email: string;
  password: string;
  active: boolean;
  activationCode: string;
  activatedAt: string;
  lastLogin: string;
  lastLogout: string;
  createdAt: string;
  updatedAt: string;
}

export type DecodedToken = {
  email: string;
  sub: number;
  iat: number;
  exp: number;
};

export type AuthenticatedUser = {
  id: number;
  email: string;
  password: string;
  active: boolean;
  permissions: string[];
  activationCode: string;
  activatedAt: string;
  lastLogin: string;
  tokenExpiration: string;
  createdAt: string;
  updatedAt: string;
};

export enum AuditAuthAssignmentType {
  assigned = 'ASSIGNED',
  revoked = 'REVOKED'
}

export enum AuditDataChangeType {
  created = 'CREATED',
  updated = 'UPDATED',
  deleted = 'DELETED'
}

export type OrderQuery<T> = { [P in keyof T]?: 'ASC' | 'DESC' };

export interface AuthenticatedServiceRequest extends Request {
  user: DecodedToken;
}

export interface FilterAllQuery<T> {
  order: OrderByCondition;
  take: number;
  skip: number;
  filter?: string;
  where?: Partial<T>;
}

export interface PaginatedResponse<T> {
  data: Array<T>;
  pagination: {
    skip: number;
    take: number;
    total: number;
  };
}

export interface ResultsAndTotal<T> {
  data: Array<T>;
  total: number;
}
