export interface IInventoryItem extends IDefaultObj {
  name: string;
  description: string;
  shortDescription: string;
  geoLocation: string;
  outerId?: string;
  organizationId?: string;
  objectType: string;
  address: IAddress;
}
export interface IInventoriesList extends Array<IInventoryItem> {}
