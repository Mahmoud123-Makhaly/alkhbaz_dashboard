import { IRevenueStatistic } from './Revenue';

export interface IRevenuePeriodDetailsStatistic
  extends Array<
    IRevenueStatistic & {
      quarter: number;
      year: number;
    }
  > {}
