'use client';

import { useState } from 'react';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { IWithCustomerDetailsProps } from '../CustomerDetails.hoc';
import { endpoints } from '@app/libs';
import { useTranslate } from '@app/hooks';
import { DataLoadingStatus, DeleteModal } from '@components/common';

const PhonesList = ({ data, toast, apiClient, loadData }: IWithCustomerDetailsProps) => {
  const [loadingStatus, setLoadingStatus] = useState<DataLoadingStatus>();
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const t = useTranslate('COMP_CustomerDetails.INFO.PHONES');
  const phones = data?.phones;

  const handleDelete = (): void => {
    setLoadingStatus(DataLoadingStatus.pending);
    apiClient
      .update(endpoints.customers.update, { ...data, phones: data?.phones.filter(x => x != selectedPhone) })
      .then(
        data => {
          if (data && data.status === 204) {
            setTimeout(() => {
              toast.success(t('DELETE_SUCCESS_MSG'));
              loadData();
            }, 500);
          } else {
            setLoadingStatus(DataLoadingStatus.done);
            toast.error(t('ERR_DELETE_MSG'));
          }
        },
        err => {
          toast.error(err.toString());
          setLoadingStatus(DataLoadingStatus.done);
        },
      );
    //eslint-disable-next-line react-hooks/exhaustive-deps
  };
  return (
    <ListGroup>
      <DeleteModal
        show={!!selectedPhone}
        onDeleteClick={() => handleDelete()}
        onCloseClick={() => setSelectedPhone(null)}
      />
      {phones &&
        phones.map((phone, indx) => (
          <ListGroupItem key={`customer-email-${indx}`}>
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <i className="ri-phone-line align-middle me-2 text-success"></i> {phone}
              </div>
              <div className="flex-shrink-0">
                <span className="text-danger">
                  <Button
                    color="danger"
                    size="sm"
                    className="avatar-title bg-white text-danger fs-15 rounded"
                    outline
                    onClick={() => setSelectedPhone(phone)}
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
export default PhonesList;
