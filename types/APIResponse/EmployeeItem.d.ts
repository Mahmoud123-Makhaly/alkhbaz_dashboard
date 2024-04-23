interface IEmployeeItem extends IDefaultObj {
  salutation: string;
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: Date;
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
  name: string;
  memberType: string;
  outerId: string;
  status: string;
  addresses: Array<IAddress>;
  phones: Array<string>;
  emails: Array<string>;
  groups: Array<string>;
  iconUrl: string;
  seoObjectType: string;
}
export interface IEmployeesList extends Array<IEmployeeItem> {}
