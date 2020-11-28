import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { getManager } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { RolesService } from '../services/roles.service';

@ValidatorConstraint({ name: 'RoleExists', async: true })
@Injectable()
export class RoleExistsValidator implements ValidatorConstraintInterface {
  constructor(protected readonly rolesService: RolesService) {}
  async validate(name: string, args: ValidationArguments) {
    const roleExistsCheck = args.constraints[0];
    const role = await getManager().transaction(async (manager) => await this.rolesService.findBy(manager, { name }));
    return roleExistsCheck ? !!role : !role;
  }

  defaultMessage(args: ValidationArguments) {
    return `role with name '${args.value}' already exists.`;
  }
}

export function RoleExists(roleExistsCheck: boolean, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'RoleExists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [roleExistsCheck],
      options: validationOptions,
      validator: RoleExistsValidator
    });
  };
}
