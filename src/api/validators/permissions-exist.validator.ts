import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { getManager, In } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { PermissionsService } from '../services/permissions.service';

@ValidatorConstraint({ name: 'PermissionsExist', async: true })
@Injectable()
export class PermissionsExistValidator implements ValidatorConstraintInterface {
  constructor(protected readonly permissionsService: PermissionsService) {}
  async validate(ids: number[]) {
    if (ids.length === 0) return true;
    const permissions = await getManager().transaction(
      async (manager) => await this.permissionsService.findAllWhere(manager, { id: In(ids) })
    );
    return ids.length === permissions.length;
  }

  defaultMessage(args: ValidationArguments) {
    return `permissions in list '${args.value}' not found.`;
  }
}

export function PermissionsExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'PermissionsExist',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: PermissionsExistValidator
    });
  };
}
