import { IPriceListItem } from './PriceListItem';

interface IPricesAssignmentItem extends IDefaultObj {
  catalogId: string;
  storeId: string;
  pricelistId?: string;
  priceList: Array<Exclude<IPriceListItem, 'assignments'>>;
  name: string;
  description: string;
  priority: number;
  startDate?: Date;
  endDate?: Date;
  outerId?: string;
}

export interface IPricesAssignmentsList extends Array<IPricesAssignmentItem> {}
