export interface IProductFulfillmentCenter extends IDefaultObj {
  fulfillmentCenterId: string;
  fulfillmentCenterName: string;
  fulfillmentCenter: IInventoryItem;
  productId: string;
  inStockQuantity: number;
  reservedQuantity: number;
  reorderMinQuantity: number;
  preorderQuantity: number;
  backorderQuantity: number;
  allowBackorder: boolean;
  allowPreorder: boolean;
  inTransit: number;
  preorderAvailabilityDate?: Date;
  backorderAvailabilityDate?: Date;
  status: string;
  outerId?: string;
}
export interface IProductFulfillmentCenterList extends Array<IProductFulfillmentCenter> {}
