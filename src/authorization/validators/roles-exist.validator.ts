import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { getManager, In } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { RolesService } from '../services/roles.service';

@ValidatorConstraint({ name: 'RolesExist', async: true })
@Injectable()
export class RolesExistValidator implements ValidatorConstraintInterface {
  constructor(protected readonly rolesService: RolesService) {}
  async validate(ids: number[]) {
    if (ids.length === 0) return true;
    const roles = await getManager().transaction(
      async (manager) => await this.rolesService.findAll(manager, { where: { id: In(ids) } })
    );
    return ids.length === roles.length;
  }

  defaultMessage(args: ValidationArguments) {
    return `roles in list '${args.value}' not found.`;
  }
}

export function RolesExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'RolesExist',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: RolesExistValidator
    });
  };
}
