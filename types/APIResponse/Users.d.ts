import { IRole } from './Role';

interface IUser extends IDefaultObj {
  storeId: string;
  memberId: string;
  isAdministrator: boolean;
  photoUrl: string;
  userType: string;
  status: string;
  password: string;
  roles: Array<IRole>;
  userRoles?: Array<{ userId: string; roleId: string }>;
  passwordExpired: boolean;
  lastPasswordChangedDate: Date;
  lastPasswordChangeRequestDate: Date;
  lastLoginDate: Date;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: Date;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  permissions?: Array<string>;
  userState?: string;
}
export interface IUsersList extends Array<IUser> {}
