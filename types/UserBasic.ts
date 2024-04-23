export interface IUserBasic {
  id: string;
  storeId: string;
  memberId: string;
  isAdministrator: boolean;
  userType: string;
  status?: string;
  createdDate: Date;
  modifiedDate: Date;
  createdBy?: string;
  modifiedBy?: string;
  userState: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
}
