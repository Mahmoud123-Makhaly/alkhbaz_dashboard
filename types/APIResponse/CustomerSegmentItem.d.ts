import { IAvailableChildren } from './AvailableChildren';
import { IChildren } from './Children';
interface IExpressionTree {
  all: boolean;
  not: boolean;
  id: string;
  availableChildren: Array<IAvailableChildren>;
  children: Array<IChildren>;
}
interface ICustomerSegmentItem extends IDefaultObj {
  name: string;
  description: string;
  userGroup: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  storeIds: Array<string>;
  expressionTree: IExpressionTree;
}
export interface ICustomerSegmentList extends Array<ICustomerSegmentItem> {}
