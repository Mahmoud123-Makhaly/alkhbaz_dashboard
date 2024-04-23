interface IOrderFilter extends IDefaultFilter {
  withPrototypes: boolean;
  onlyRecurring: boolean;
  subscriptionId: string;
  subscriptionIds: Array<string>;
  operationId: string;
  customerId: string;
  customerIds: Array<string>;
  organizationId: string;
  organizationIds: Array<string>;
  ids: Array<string>;
  hasParentOperation: boolean;
  parentOperationId: string;
  employeeId: string;
  storeIds: Array<string>;
  status: string;
  statuses: Array<string>;
  number: string;
  numbers: Array<string>;
  startDate: Date;
  endDate: Date;
  responseGroup: string;
  objectType: string;
  objectTypes: Array<string>;
  objectIds: Array<string>;
  keyword: string;
  searchPhrase: string;
  languageCode: string;
  fulfillmentCenterId?: string;
  fulfillmentCenterIds?: Array<string>;
  customerMobile?: string;
}

export interface IOrdersFilter extends Partial<IOrderFilter> {}
