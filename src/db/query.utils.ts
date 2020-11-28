import { EntityManager, SelectQueryBuilder } from 'typeorm';

export const dbUserIdVarName = 'app.auth.auth_user_id';

export const setUser = async ({ id: userId }: { id?: number }, manager: EntityManager) =>
  Number.isInteger(userId) ? await manager.query(`set local ${dbUserIdVarName} = ${userId}`) : false;

export const existsQuery = <T>(builder: SelectQueryBuilder<T>) => `exists (${builder.getQuery()})`;
