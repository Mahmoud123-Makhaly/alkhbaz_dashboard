export interface IProductBasic {
  id?: string;
  outerId?: string;
  name: string;
  minQuantity: number;
  maxQuantity: number;
  taxType: string;
  vendor: string;
  isBuyable: boolean;
  trackInventory: boolean;
  isActive: boolean;
  code: string;
  gtin: string;
  priority: number;
  firstListed: string;
  expiresOn: Date;
  createdDate?: Date;
}
