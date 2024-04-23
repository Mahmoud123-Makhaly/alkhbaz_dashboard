import { ISettings } from './Settings';

export interface IPaymentMethod {
  paymentMethodGroupType: string;
  paymentMethodType: string;
  shA5Hash: string;
  code: string;
  name: string;
  logoUrl?: string;
  isActive: boolean;
  priority: number;
  isAvailableForPartial: boolean;
  allowDeferredPayment: boolean;
  currency?: string;
  price: number;
  priceWithTax: number;
  total: number;
  totalWithTax: number;
  discountAmount: number;
  discountAmountWithTax: number;
  storeId: string;
  description: string;
  typeName: string;
  settings: Array<ISettings>;
  taxType?: string;
  taxTotal: number;
  taxPercentRate: number;
  taxDetails?: string;
  id: string;
}
