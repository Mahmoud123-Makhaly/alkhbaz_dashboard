export interface IProductFulfillmentCenterFilter {
  keyword?: string;
  fulfillmentCenterName?: string;
  inStockQuantity?: string;
  reservedQuantity?: string;
  sort: ISortType;
  skip: number;
  take: number;
}
