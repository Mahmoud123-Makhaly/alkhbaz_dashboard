import { DynamicPropertyValueType } from '@helpers/constants';

export interface IPropertiesValue {
  propertyName?: string;
  propertyId?: string;
  languageCode?: string;
  alias?: string;
  valueType?: DynamicPropertyValueType;
  valueId?: string;
  value?: any;
  propertyMultivalue?: boolean;
  outerId?: string;
  isInherited?: boolean;
  ObjectType?: string;
  ObjectId?: string;
  Locale?: string;
  id?: string;
}
export interface IPropertiesAttribute extends IDefaultObj {
  propertyId: string;
  displayNames?: Array<IPropertiesDisplayName>;
  name: string;
  value: string;
}

export interface ICatalogPropertiesAttribute extends IDefaultObj {
  propertyId: string;
  localizedValues?: Array<{ languageCode: string; value: any }>;
  sortOrder: number;
  alias: string;
}
export interface IPropertiesDisplayName {
  name: string;
  languageCode: string;
  locale: string;
}

export interface IPropertiesValidationRule extends IDefaultObj {
  isUnique: boolean;
  charCountMin?: number;
  charCountMax?: number;
  regExp?: string;
  propertyId: string;
}
export interface IProperties extends IDefaultObj {
  isReadOnly: boolean;
  isManageable: boolean;
  isNew: boolean;
  catalogId?: string;
  categoryId?: string;
  name: string;
  required: boolean;
  dictionary: boolean;
  multivalue: boolean;
  multilanguage: boolean;
  hidden: boolean;
  valueType: DynamicPropertyValueType;
  type: string;
  outerId?: string;
  ownerName?: string;
  displayOrder?: number;
  values: Array<IPropertiesValue>;
  attributes?: Array<IPropertiesAttribute>;
  displayNames?: Array<IPropertiesDisplayName>;
  validationRules?: Array<IPropertiesValidationRule>;
  validationRule?: IPropertiesValidationRule;
  isInherited: boolean;
  description?: string;
  objectType: string;
  isArray: boolean;
  isDictionary: boolean;
  isMultilingual: boolean;
  isRequired: boolean;
}
