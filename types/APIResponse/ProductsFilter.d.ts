import { ISortType } from './SortType';
interface IPriceRange {
  lower: number;
  upper: number;
  includeLower: boolean;
  includeUpper: boolean;
}
interface ILocation {
  latitude: number;
  longitude: number;
}
interface IGeoDistance {
  fieldName: string;
  location: ILocation;
  distance: number;
}
export interface IProductFilter extends IDefaultFilter {
  objectType: string;
  productType: string;
  currency: string;
  pricelists: Array<string>;
  priceRange: IPriceRange;
  classTypes: Array<string>;
  withHidden: boolean;
  searchInVariations: boolean;
  startDate: Date;
  startDateFrom: Date;
  endDate: Date;
  includeAggregations: Array<string>;
  excludeAggregations: Array<string>;
  geoDistanceFilter: IGeoDistance;
  storeId: string;
  catalogId: string;
  catalogIds: Array<string>;
  outline: string;
  outlines: Array<string>;
  terms: Array<string>;
  userGroups: Array<string>;
  isFuzzySearch: boolean;
  rawQuery: string;
  includeFields: Array<string>;
  searchPhrase: string;
  keyword: string;
  // TODO: get types from BE and replace string as type
  responseGroup: string;
  objectTypes: Array<string>;
  objectIds: Array<string>;
  languageCode: string;
}
export interface IProductsFilter extends Partial<IProductFilter> {}
