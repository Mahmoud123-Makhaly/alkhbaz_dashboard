interface ICategoryItem extends IDefaultObj {
  catalogId: string;
  parentId: string;
  code: string;
  name: string;
  outline: string;
  path: string;
  isVirtual: boolean;
  level: number;
  packageType: string;
  priority: number;
  isActive: boolean;
  outerId: string;
  taxType: string;
  seoObjectType: string;
  enableDescription: boolean;
  imgSrc: string;
  isInherited: boolean;
}

export interface ICategoriesList extends Array<ICategoryItem> {}
