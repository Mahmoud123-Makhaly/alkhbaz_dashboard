interface IPromotionItem extends IDefaultObj {
  isAllowCombiningWithSelf: boolean;
  dynamicExpression: IDynamicExpression;
  store: string;
  storeIds: Array<string>;
  name: string;
  type: string;
  isActive: boolean;
  priority: number;
  isExclusive: boolean;
  hasCoupons: boolean;
  description: string;
  maxUsageCount: number;
  maxUsageOnOrder: number;
  maxPersonalUsageCount: number;
  startDate: Date;
  endDate: Date;
  outerId: string;
}
export interface IPromotionsList extends Array<IPromotionItem> {}
