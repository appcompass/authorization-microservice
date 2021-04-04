import { IsNumber } from 'class-validator';

export class RowsAffectedResponse {
  @IsNumber()
  affected: number;
}
