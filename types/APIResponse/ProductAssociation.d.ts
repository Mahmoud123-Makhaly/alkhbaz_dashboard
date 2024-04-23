export interface IProductAssociation {
  type: string;
  priority: number;
  quantity: number;
  itemId: string;
  associatedObjectId: string;
  associatedObjectType: string;
  outerId?: string;
  associatedObjectName: string;
  associatedObjectImg: string;
  tags?: Array<string>;
  imgSrc: string;
  images?: Array<IProductImage>;
  id: string;
}
