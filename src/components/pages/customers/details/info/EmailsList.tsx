'use client';

import { useState } from 'react';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { endpoints } from '@app/libs';
import { DataLoadingStatus, DeleteModal } from '@components/common';
import { useTranslate } from '@app/hooks';
import withCustomerDetails, { IWithCustomerDetailsProps } from '../CustomerDetails.hoc';

const EmailsList = ({
  data,
  toast,
  apiClient,
  dataLoadingStatus,
  setDataLoadingStatus,
  loadData,
}: IWithCustomerDetailsProps) => {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const t = useTranslate('COMP_CustomerDetails.INFO.EMAILS');
  const emails = data?.emails;

  const handleDelete = (): void => {
    setDataLoadingStatus(DataLoadingStatus.pending);
    apiClient
      .update(endpoints.customers.update, { ...data, emails: data?.emails.filter(x => x != selectedEmail) })
      .then(
        data => {
          if (data && data.status === 204) {
            setTimeout(() => {
              toast.success(t('DELETE_SUCCESS_MSG'));
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
    <ListGroup>
      <DeleteModal
        show={!!selectedEmail}
        onDeleteClick={() => handleDelete()}
        onCloseClick={() => setSelectedEmail(null)}
      />
      {emails &&
        emails.map((email, indx) => (
          <ListGroupItem key={`customer-email-${indx}`}>
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <i className="ri-mail-line align-middle me-2 text-primary"></i> {email}
              </div>
              <div className="flex-shrink-0">
                <span className="text-danger">
                  <Button
                    color="danger"
                    size="sm"
                    className="avatar-title bg-white text-danger fs-15 rounded"
                    outline
                    onClick={() => setSelectedEmail(email)}
                  >
                    <i className="ri-delete-bin-fill align-bottom"></i>
                  </Button>
                </span>
              </div>
            </div>
          </ListGroupItem>
        ))}
    </ListGroup>
  );
};
export default withCustomerDetails(EmailsList);
