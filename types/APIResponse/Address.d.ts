export interface IAddress {
  addressType: string;
  key?: string;
  name?: string;
  organization?: string;
  countryCode?: string;
  countryName?: string;
  city?: string;
  postalCode?: string;
  zip?: string;
  line1?: string;
  line2?: string;
  regionId?: string;
  regionName?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  outerId?: string;
  isDefault: boolean;
  description?: string;
}
