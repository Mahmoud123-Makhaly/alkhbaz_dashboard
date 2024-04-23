import { IAddress } from './Address';
import { IUser } from './Users';

export interface INotes extends IDefaultObj {
  title: string;
  body: string;
  outerId: string;
}

export interface ICustomerItem extends IDefaultObj {
  salutation: string;
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate?: Date;
  defaultLanguage: string;
  timeZone: string;
  organizations: Array<string>;
  associatedOrganizations: Array<string>;
  taxPayerId: string;
  preferredDelivery: string;
  preferredCommunication: string;
  defaultShippingAddressId: string;
  defaultBillingAddressId: string;
  photoUrl: string;
  isAnonymized: boolean;
  about: string;
  objectType: string;
  securityAccounts: Array<IUser>;
  name: string;
  memberType: string;
  outerId: string;
  status: string;
  addresses: Array<IAddress>;
  phones: Array<string>;
  emails: Array<string>;
  notes: Array<INotes>;
  groups: Array<string>;
  iconUrl: string;
  dynamicProperties: Array<any>;
  seoObjectType: string;
  seoInfos: Array<ISeoInfo>;
}

export interface ICustomersList extends Array<ICustomerItem> {}
