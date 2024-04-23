export interface IProductPriceWidget extends IDefaultObj {
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
export interface IProductPriceWidgetList extends Array<IProductPriceWidget> {}
