export interface IDictionaryItemLocalizedValue {
  languageCode: string;
  value: string;
}
export interface IDictionaryItem {
  propertyId: string;
  alias: string;
  sortOrder: number;
  localizedValues?: Array<IDictionaryItemLocalizedValue>;
  id: string;
}
export interface IDictionaryItems extends Array<IDictionaryItem> {}
