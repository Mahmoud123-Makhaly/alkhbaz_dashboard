interface IOrganizationItem extends IDefaultObj {
  description: string;
  businessCategory: string;
  ownerId: string;
  parentId: string;
  objectType: string;
  name: string;
  memberType: string;
  outerId: string;
  status: string;
  iconUrl: string;
  seoObjectType: string;
  emails: Array<string>;
  groups: Array<string>;
  phones: Array<string>;
  addresses: Array<IAddress>;
}
export interface IOrganizationsList extends Array<IOrganizationItem> {}
