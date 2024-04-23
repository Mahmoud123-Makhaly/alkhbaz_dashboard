interface ICouponItem extends IDefaultObj {
  maxUsesNumber: number;
  maxUsesPerUser: number;
  expirationDate: string;
  code: string;
  promotionId: string;
  totalUsesCount: number;
  outerId: string;
  memberId: string;
  createdDate: string;
  modifiedDate: string;
  createdBy: string;
  modifiedBy: string;
  id: string;
}
export interface ICouponsList extends Array<ICouponItem> {}
