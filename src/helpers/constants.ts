export enum FileSizeType {
  B = 'b',
  GB = 'GB',
  KB = 'KB',
  MB = 'MB',
  TB = 'TB',
  PB = 'PB',
  EB = 'EB',
  ZB = 'ZB',
  YB = 'YB',
}

export enum Locals {
  en,
  ar,
}

export const DefaultLangCode = 'ar-EG';
export const DefaultCountry = { code: 'EGY', name: 'Egypt' };
export const DefaultProductDescriptionType = 'FullReview';

export enum CustomerOrderStatus {
  New = 'New',
  NotPayed = 'Not payed',
  Pending = 'Pending',
  Processing = 'Processing',
  ReadyToSend = 'Ready to send',
  Cancelled = 'Cancelled',
  PartiallySent = 'Partially sent',
  Completed = 'Completed',
  Prepared = 'Prepared',
  Shipping = 'Shipping',
  Paid = 'Paid',
  Rejected = 'Rejected',
}

export enum ShipmentStatus {
  New = 'New',
  PickPack = 'PickPack',
  Cancelled = 'Cancelled',
  ReadyToSend = 'ReadyToSend',
  Sent = 'Sent',
}

export enum OrderOperationTypes {
  PaymentIn,
  Shipment,
  CustomerOrder,
  Refund,
  Capture,
}

export enum ObjectTypes {
  CustomerOrder = 'TotPlatform.OrdersModule.Core.Model.CustomerOrder',
}

export enum DynamicPropertyValueType {
  Undefined,
  ShortText,
  LongText,
  Integer,
  Decimal,
  DateTime,
  Boolean,
  Html,
  Image,
}

export enum SecurityUserRoles {
  Administrator = '__administrator',
  MarketingManager = 'Marketing Manager',
  CallCenterAgent = 'Call Center Agent',
  StoreManager = 'Store Manager',
}

export const sysPaths = ['/403', '505', 'offline', '/login'];
