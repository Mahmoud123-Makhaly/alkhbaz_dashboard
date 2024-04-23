import { Locals } from '@helpers/constants';

export interface IDataIntegrationConfig {
  id: string;
  img: string;
  endpoint: string;
  label: { [k in Locals]: string };
  successMsgs: { [k in Locals]: string };
  failedMsgs: { [k in Locals]: string };
}
export interface ICardDetails extends IDataIntegrationConfig {
  status: 'mounted' | 'sync' | 'success' | 'danger';
  response: [];
}
export interface ICardData extends Array<ICardDetails> {}
