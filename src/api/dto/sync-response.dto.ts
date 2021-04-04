import { IsNumber } from 'class-validator';

export class SyncResponse {
  /**
   * The list of IDs for removed associations
   */
  @IsNumber({}, { each: true })
  readonly removed: number[];

  /**
   * The list of IDs for added associations
   */
  @IsNumber({}, { each: true })
  readonly added: number[];

  /**
   * The list of IDs for unchanged associations
   */
  @IsNumber({}, { each: true })
  readonly unchanged: number[];
}
