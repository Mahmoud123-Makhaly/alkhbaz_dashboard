export interface IAddProductPrice extends IDefaultObj {
  productId: string;
  product: IProductItem;
  prices: Array<IPrices>;
}
export interface IAddProductPricesList extends Array<IAddProductPrice> {}
