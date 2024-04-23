import {
  IAvgOrderValueStatistic,
  IRevenuePerCustomerStatistic,
  IRevenuePeriodDetailsStatistic,
  IRevenueStatistic,
} from './index';

export interface IOrderDashboardStatistics {
  startDate: Date;
  endDate: Date;
  revenue: Array<IRevenueStatistic>;
  revenuePerCustomer: IRevenuePerCustomerStatistic;
  revenuePeriodDetails: IRevenuePeriodDetailsStatistic;
  avgOrderValue: Array<IAvgOrderValueStatistic>;
  avgOrderValuePeriodDetails: Array<IAvgOrderValueStatistic>;
  orderCount: number;
  customersCount: number;
  itemsPurchased: number;
  lineItemsPerOrder: number;
}

export interface IOrderStatistics {
  [k: string]: number;
}
