import {
  IProductItem,
  IProductFulfillmentCenterList,
  IProductPriceWidgetList,
  IPricesList,
  IRateReviewList,
} from './APIResponse';
export interface IProductDetails {
  info?: IProductItem;
  fulfillmentCenters?: IProductFulfillmentCenterList;
  prices?: IPricesList;
  priceWidgets?: IProductPriceWidgetList;
  reviewList?: IRateReviewList;
}
