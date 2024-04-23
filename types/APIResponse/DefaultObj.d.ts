interface IDefaultObj
  extends Partial<{
    createdDate: Date;
    modifiedDate: Date;
    createdBy: string;
    modifiedBy: string;
    id: string;
  }> {}
