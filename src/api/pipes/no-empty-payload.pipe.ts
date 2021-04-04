import { Injectable, PipeTransform, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class NoEmptyPayloadPipe implements PipeTransform {
  transform(payload: object) {
    if (!Object.keys(payload).length) throw new UnprocessableEntityException('Payload should not be empty');
    return payload;
  }
}
