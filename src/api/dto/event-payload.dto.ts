import { IsString, ValidateNested } from 'class-validator';

export class EventPayload<T> {
  @IsString()
  readonly respondTo: string;

  @ValidateNested()
  readonly data: T;
}
