export interface IDataTableAction {
  iconClassName: string | undefined;
  label: string;
  onClick: (obj: unknown) => unknown;
}
export interface IDataTableActionsProps {
  data: any;
  excludedActions?: Array<'view' | 'edit' | 'delete' | 'add'>;
  extraActions?: Array<IDataTableAction>;
  onView?: (obj: unknown) => unknown;
  onAdd?: (obj: unknown) => unknown;
  onEdit?: (obj: unknown) => unknown;
  onDelete?: (obj: unknown) => unknown;
}
