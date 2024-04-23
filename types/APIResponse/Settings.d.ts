export interface ISettings {
  itHasValues: boolean;
  objectId: string;
  objectType: string;
  isReadOnly: boolean;
  value?: string;
  id: string;
  restartRequired: boolean;
  moduleId: string;
  groupName: string;
  name: string;
  displayName?: string;
  isRequired: boolean;
  isHidden: boolean;
  valueType: string;
  allowedValues: Array<string>;
  defaultValue: string;
  isDictionary: boolean;
}
