'use client';

import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { useTranslate } from '@app/hooks';
import { IDataTableActionsProps } from './DataTableActions.types';
import { Utils } from '@helpers/utils';
const DataTableActions = (props: IDataTableActionsProps) => {
  const { data, onView, onAdd, onEdit, onDelete, excludedActions, extraActions } = props;
  const t = useTranslate('COMP_DataTableActions');
  const presetActions = {
    view: (
      <DropdownItem
        key={'COMP_DTA' + Math.random().toString()}
        onClick={e => {
          if (onView) onView(data);
        }}
      >
        <i className="ri-eye-fill align-bottom me-2 text-secondary"></i>
        {t('VIEW')}
      </DropdownItem>
    ),
    edit: (
      <DropdownItem
        className="edit-item-btn"
        key={'COMP_DTA' + Math.random().toString()}
        onClick={e => {
          if (onEdit) onEdit(data);
        }}
      >
        <i className="ri-pencil-fill align-bottom me-2 text-primary"></i>
        {t('EDIT')}
      </DropdownItem>
    ),
    delete: (
      <DropdownItem
        className="remove-item-btn"
        key={'COMP_DTA' + Math.random().toString()}
        onClick={e => {
          if (onDelete) onDelete(data);
        }}
      >
        <i className="ri-delete-bin-fill align-bottom me-2 text-danger"></i> {t('DELETE')}
      </DropdownItem>
    ),
    add: (
      <DropdownItem
        key={'COMP_DTA' + Math.random().toString()}
        onClick={e => {
          if (onAdd) onAdd(data);
        }}
      >
        <i className="ri-add-fill align-bottom me-2 text-success"></i>
        {t('ADD')}
      </DropdownItem>
    ),
  };
  const actualActions = Utils.objToArrayOfKeyAndValue(
    excludedActions ? Utils.removeObjectKeys(presetActions, excludedActions) : presetActions,
  ) as Array<any>;
  return (
    <UncontrolledDropdown className="dropdown d-inline-block">
      <DropdownToggle className="btn btn-soft-secondary btn-sm" tag="button">
        <i className="ri-more-2-fill align-middle"></i>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end">
        {actualActions.map(elem => elem[Utils.getObjFirstKey(elem)])}
        {extraActions &&
          extraActions.map((elem, indx) => (
            <DropdownItem
              key={'COMP_DTA' + indx}
              onClick={e => {
                elem.onClick(data);
              }}
            >
              <i className={(elem.iconClassName ? elem.iconClassName + ' ' : '') + 'align-bottom me-2'}></i>
              {elem.label}
            </DropdownItem>
          ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};
export default DataTableActions;
