interface ICartFilter extends IDefaultFilter {
  name: string;
  customerId: string;
  storeId: string;
  currency: string;
  status: string;
  type: string;
  customerIds: [string];
  organizationId: string;
  createdStartDate: string;
  createdEndDate: string;
  modifiedStartDate: string;
  modifiedEndDate: string;
  responseGroup: string;
  objectType: string;
  objectTypes: [string];
  objectIds: [string];
  keyword: string;
  searchPhrase: string;
  languageCode: string;
}
export interface ICartsFilter extends Partial<ICartFilter> {}
