import { IOrderItem } from './OrderItem';

export interface ICartItem
  extends Omit<
    IOrderItem,
    | 'cancelledDate'
    | 'cancelReason'
    | 'comment'
    | 'feeDetails'
    | 'isCancelled'
    | 'outerId'
    | 'price'
    | 'priceWithTax'
    | 'reserveQuantity'
    | 'status'
  > {
  isReadOnly: boolean;
  isReccuring: boolean;
  isRejected: boolean;
  languageCode?: string;
  listPrice: number;
  listPriceWithTax: number;
  note?: string;
  requiredShipping: boolean;
  salePrice?: number;
  salePriceWithTax?: number;
  taxIncluded: boolean;
  thumbnailImageUrl?: string;
  validationType?: string;
  volumetricWeight?: string;
}
