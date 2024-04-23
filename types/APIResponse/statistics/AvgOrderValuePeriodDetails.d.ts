import { IAvgOrderValueStatistic } from './AvgOrderValue';

export interface IAvgOrderValuePeriodDetailsStatistic
  extends Array<
    IAvgOrderValueStatistic & {
      quarter: number;
      year: number;
    }
  > {}
