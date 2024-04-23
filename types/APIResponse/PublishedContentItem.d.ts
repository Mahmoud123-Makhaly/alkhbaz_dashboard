import { IContentItem } from './ContentItem';
import { IContentPlaceItem } from './ContentPlaceItem';

interface IPublishedContentItem extends IDefaultObj {
  name: string;
  description: string;
  priority: number;
  isActive: boolean;
  storeId: string;
  dynamicExpression: IDynamicExpression;
  startDate: Date;
  endDate: Date;
  outerId: string;
  contentItems: Array<IContentItem>;
  contentPlaces: Array<IContentPlaceItem>;
}
export interface IPublishedContentsList extends Array<IPublishedContentItem> {}
