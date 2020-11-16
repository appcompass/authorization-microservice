import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isOrderQueryString', async: false })
@Injectable()
export class OrderQueryValidator implements ValidatorConstraintInterface {
  private pattern = /\w+:(?!asc|desc)\w+/gi;

  validate(value: string) {
    return typeof value === 'string' && !value.match(this.pattern);
  }

  defaultMessage(args: ValidationArguments) {
    const errors = args.value.match(this.pattern);
    const errorsAsString = errors.join(', ');
    const errorLabel = errors.length === 1 ? 'Error' : 'Errors';
    return `'${args.property}' must be in the format of 'foo:asc,foo2:desc,foo3'. (${errorLabel}: ${errorsAsString})`;
  }
}

export function IsOrderQueryString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsOrderQueryString',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: OrderQueryValidator
    });
  };
}
