interface IAssignedScopes {
  type: string;
  label: string;
  scope: string;
}
interface IAvailableScopes {
  type: string;
  label: string;
  scope: string;
}
interface IPermissions {
  id: string;
  name: string;
  moduleId: string;
  groupName: string;
  assignedScopes: Array<IAssignedScopes>;
  availableScopes: Array<IAvailableScopes>;
}
interface IRole {
  description: string;
  permissions: Array<IPermissions>;
  userRoles?: Array<{ userId: string; roleId: string }>;
  id: string;
  name: string;
  normalizedName: string;
  concurrencyStamp: string;
}

export interface IRolesList extends Array<IRole> {}
