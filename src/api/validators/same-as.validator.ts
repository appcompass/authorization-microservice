import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isSameAs', async: false })
@Injectable()
export class SameAsValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const relatedValue = args.object[args.constraints[0]];
    return typeof value === typeof relatedValue && value === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    return `'${args.property}' must be the same as '${args.constraints[0]}'`;
  }
}

export function IsSameAs(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsSameAs',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: SameAsValidator
    });
  };
}
