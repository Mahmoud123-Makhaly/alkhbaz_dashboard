'user client';
import React, { useState } from 'react';
import { Button } from 'reactstrap';
import moment from 'moment';

import { endpoints } from '@app/libs';
import { useTranslate } from '@app/hooks';
import {
  ClientOnly,
  DataLoadingStatus,
  DeleteModal,
  EndSideBar,
  IRGBYSoft,
  RGBYSoft,
  SwitchButton,
  ToolTip,
} from '@components/common';
import { EditUserBasicForm, ResetPasswordBasicForm } from '@components/pages';

import { IWithCustomerDetailsProps } from '../CustomerDetails.hoc';
const SecurityPane = ({ data, apiClient, toast, loadData, setDataLoadingStatus }: IWithCustomerDetailsProps) => {
  const user = data?.securityAccounts[0];
  const [modalMode, setModalMode] = useState<{
    mode: 'edit' | 'reset' | null;
    header?: string;
    key?: string;
  }>({
    mode: null,
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const RGBYPreset: IRGBYSoft = {
    danger: ['Deleted', 'Rejected'],
    success: 'Approved',
    primary: 'New',
  };
  const t = useTranslate('COMP_CustomerDetails.INFO.SECURITY');
  const modalToggle = (mode: 'edit' | 'reset' | null, key?) => {
    if (mode === 'reset') {
      setModalMode({ mode: mode, key, header: t('RESET_PASSWORD') });
    } else {
      setModalMode({ mode: mode, key, header: t('EDIT_USER') });
    }
  };
  const handleFormSubmit = (): void => {
    modalToggle(null);
    loadData();
  };
  const onHandleDelete = () => {
    setDeleteModal(true);
  };
  const handleDelete = (): void => {
    setDeleteModal(false);
    setDataLoadingStatus(DataLoadingStatus.pending);
    apiClient.delete(endpoints.users.delete, { names: user!.userName }).then(
      data => {
        if (data) {
          toast.success(t('DELETE_SUCCESS_MSG'));
          setTimeout(() => {
            loadData();
          }, 500);
        } else {
          setDataLoadingStatus(DataLoadingStatus.done);
          toast.error(t('ERR_DELETE_MSG'));
        }
      },
      err => {
        toast.error(err.toString());
        setDataLoadingStatus(DataLoadingStatus.done);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
  return (
    <ClientOnly>
      <DeleteModal show={deleteModal} onDeleteClick={() => handleDelete()} onCloseClick={() => setDeleteModal(false)} />

      <div className="table-responsive">
        <div className="d-flex justify-content-end">
          <div className="mx-1">
            <ToolTip placement="top" msg={t('RESET_PASSWORD')} id={'customer-reset-pass'}>
              <Button className="btn btn-warning" onClick={() => modalToggle('reset', user!.userName)}>
                <i className="ri-rotate-lock-fill align-bottom"></i>
              </Button>
            </ToolTip>
          </div>
          <div className="mx-1">
            <Button color="danger" className="btn" outline onClick={onHandleDelete}>
              <i className="ri-delete-bin-fill align-bottom"></i>
            </Button>
          </div>
          <div className="mx-1">
            <Button className="btn btn-light" onClick={() => modalToggle('edit', user!.id)}>
              <i className="ri-pencil-fill align-bottom"></i>
            </Button>
          </div>
        </div>
        <table className="table mb-0">
          <tbody>
            <tr>
              <th scope="row" style={{ width: '20%' }}>
                {t('USERNAME_LABEL')}
              </th>
              <td>{user!.userName}</td>
            </tr>
            <tr>
              <th scope="row">{t('EMAIL_LABEL')}</th>
              <td>{user!.email}</td>
            </tr>
            <tr>
              <th scope="row">{t('PHONE_NUMBER_LABEL')}</th>
              <td>{user!.phoneNumber ? user?.phoneNumber : t('N/A')}</td>
            </tr>
            <tr>
              <th scope="row">{t('STATUS_LABEL')}</th>
              <td>
                <span className="badge fs-13 fw-medium w-auto">
                  <RGBYSoft preset={RGBYPreset} value={user!.status} />
                </span>
              </td>
            </tr>
            <tr>
              <th scope="row">{t('ROLES_LABEL')}</th>
              <td>
                {user?.roles && user.roles.length > 0
                  ? user.roles.map((role, indx) => (
                      <div key={`customer-account-role-${indx}`} className="badge fw-medium badge-soft-info me-1">
                        {role.name}
                      </div>
                    ))
                  : t('N/A')}
              </td>
            </tr>
            <tr>
              <th scope="row">{t('USER_TYPE_LABEL')}</th>
              <td>{user!.userType}</td>
            </tr>
            <tr>
              <th scope="row">{t('CONFIRM_PHONE_LABEL')}</th>
              <td>
                <SwitchButton checked={user!.phoneNumberConfirmed} disabled />
              </td>
            </tr>
            <tr>
              <th scope="row">{t('CONFIRM_EMAIL_LABEL')}</th>
              <td>
                <SwitchButton checked={user!.emailConfirmed} disabled />
              </td>
            </tr>
            <tr>
              <th scope="row">{t('ADMINISTRATOR_LABEL')}</th>
              <td>
                <SwitchButton checked={user!.isAdministrator} disabled />
              </td>
            </tr>
            <tr>
              <th scope="row">{t('LOCK_LABEL')}</th>
              <td>
                <SwitchButton checked={user!.lockoutEnabled} disabled />
              </td>
            </tr>
            <tr>
              <th scope="row">{t('CREATED_LABEL')}</th>
              <td>{moment(user!.createdDate).format('DD, MMM yyyy')}</td>
            </tr>
            <tr>
              <th scope="row">{t('MODIFIED_LABEL')}</th>
              <td>{moment(user!.modifiedDate).format('DD, MMM yyyy')}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <EndSideBar isOpen={!!modalMode.mode} title={modalMode.header!} toggle={() => modalToggle(null)}>
        {modalMode.mode === 'edit' && (
          <EditUserBasicForm onCancel={() => modalToggle(null)} onSubmit={handleFormSubmit} id={user?.id} />
        )}
        {modalMode.mode === 'reset' && (
          <ResetPasswordBasicForm
            onCancel={() => modalToggle(null)}
            onSubmit={handleFormSubmit}
            userName={modalMode.key!}
          />
        )}
      </EndSideBar>
    </ClientOnly>
  );
};
export default SecurityPane;
