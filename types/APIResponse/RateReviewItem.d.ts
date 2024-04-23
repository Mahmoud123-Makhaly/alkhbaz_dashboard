export interface IRateReviewItem {
  id: string;
  entityId: string;
  entityName: string;
  entityType: string;
  productName: string;
  reviewStatus: string;
  reviewStatusId: number;
  title: string;
  review: string;
  rating: number;
  userName: string;
  storeName: string;
  createdDate: Date;
}
export interface IRateReviewList {
  totalCount: number;
  results: Array<IRateReviewItem>;
}
