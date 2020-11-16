import { IsNumberString, IsOptional } from 'class-validator';

import { IsOrderQueryString } from '../validators/order-query-string.validator';

export class SortListQuery {
  @IsOptional()
  @IsNumberString()
  readonly take: string = '20';

  @IsOptional()
  @IsNumberString()
  readonly skip: string = '0';

  @IsOptional()
  @IsOrderQueryString()
  readonly order: string = 'id:asc';
}
