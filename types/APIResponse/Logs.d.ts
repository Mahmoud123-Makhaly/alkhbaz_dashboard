export interface ILog extends IDefaultObj {
  objectType: string;
  objectId: string;
  operationType: string;
  detail: string;
}
export interface ILogsList extends Array<ILog> {}
