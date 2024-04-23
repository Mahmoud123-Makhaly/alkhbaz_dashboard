import { ITenantIdentity } from './TenantIdentity';

export interface INotification extends IDefaultObj {
  kind: string;
  from?: string;
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  body?: string;
  attachments: Array<any>;
  type: string;
  tenantIdentity: ITenantIdentity;
  notificationId: string;
  notificationType: string;
  sendAttemptCount: number;
  maxSendAttemptCount: number;
  lastSendError: string;
  lastSendAttemptDate?: Date;
  sendDate?: Date;
  languageCode: string;
  status: string;
}
export interface INotificationsList extends Array<INotification> {}
