import { IPricesAssignmentsList } from './PricesAssignmentItem';

interface IPrices extends IDefaultObj {
  pricelistId: string;
  pricelist?: Array<IPriceListItem>;
  currency: string;
  productId: string;
  sale: number;
  list: number;
  minQuantity: number;
  startDate?: Date;
  endDate?: Date;
  effectiveValue: number;
  outerId?: string;
}

interface IPriceListItem extends IDefaultObj {
  name: string;
  description: string;
  currency: string;
  outerId?: string;
  priority: number;
  prices: Array<IPrices>;
  assignments: Array<IPricesAssignmentsList>;
}
export interface IPricesList extends Array<IPriceListItem> {}
