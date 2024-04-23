'use client';

import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { IProductDetails } from '@app/types';
import Image from 'next/image';
import { Utils } from '@helpers/utils';
import { DefaultLangCode } from '@helpers/constants';
import { ClientOnly, DataLoadingStatus, DeleteModal } from '@components/common';
import { useState } from 'react';
import { ToastContent } from 'react-toastify';
import { IApiAPPClient, endpoints } from '@app/libs';
import { useTranslate } from '@app/hooks';

const ProductDescPreview = ({
  apiClient,
  data,
  toast,
  setDataLoadingStatus,
  loadData,
  onEdit,
}: {
  apiClient: IApiAPPClient;
  data: IProductDetails | null;
  dataLoadingStatus: DataLoadingStatus | undefined;
  toast: {
    success: (content: ToastContent) => void;
    info: (content: ToastContent) => void;
    error: (content: ToastContent) => void;
    warn: (content: ToastContent) => void;
  };
  setDataLoadingStatus: React.Dispatch<React.SetStateAction<DataLoadingStatus | undefined>>;
  loadData: () => Promise<void>;
  onEdit: (id: string) => void;
}) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletedDescId, setDeletedDescId] = useState<string | null>(null);
  const t = useTranslate('COMP_ProductDescPreview');

  const handleDelete = (): void => {
    const descriptionData = [...(data?.info?.reviews?.filter(x => x.id != deletedDescId) || [])];

    if (descriptionData) {
      setDeleteModal(false);
      setDataLoadingStatus(DataLoadingStatus.pending);
      apiClient
        .create(endpoints.products.update, {
          ...data?.info,
          reviews: [...descriptionData],
        })
        .then(
          data => {
            if (data) {
              setTimeout(() => {
                toast.success(t('DELETE_DESC_SUCCESS_MSG'));
                loadData();
              }, 300);
            } else {
              setDataLoadingStatus(DataLoadingStatus.done);
              toast.error(t('ERR_DELETE_DESC_MSG'));
            }
          },
          err => {
            toast.error(err.toString());
            setDataLoadingStatus(DataLoadingStatus.done);
          },
        );
    }
  };

  return (
    <ClientOnly>
      <DeleteModal show={deleteModal} onDeleteClick={() => handleDelete()} onCloseClick={() => setDeleteModal(false)} />
      <ListGroup>
        {data?.info?.reviews &&
          data?.info?.reviews.map((d, indx) => (
            <ListGroupItem key={'prod-desc-' + indx} tag="a" to="#" className="list-group-item-action">
              <div className="float-end">
                <Button
                  color="danger"
                  outline
                  onClick={() => {
                    setDeleteModal(true);
                    setDeletedDescId(d.id);
                  }}
                >
                  <i className="ri-delete-bin-fill align-bottom"></i>
                </Button>
              </div>
              <div className="float-end mx-1">
                <Button color="primary" outline onClick={() => onEdit(d.id)}>
                  <i className="ri-pencil-fill align-bottom"></i>
                </Button>
              </div>
              <div className="d-flex mb-2 align-items-center">
                <div className="flex-shrink-0 avatar-xxs rounded-circle">
                  <Image
                    src={
                      d.languageCode
                        ? Utils.getFlagByLangCode(d.languageCode).src
                        : Utils.getFlagByLangCode(DefaultLangCode)
                    }
                    alt={d.reviewType}
                    className="avatar-xxs rounded-circle"
                    width={0}
                    height={0}
                    loading="lazy"
                    sizes="100vw"
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5 className="list-title fs-15 mb-1">{d.reviewType}</h5>
                  <p className="list-text mb-0 fs-12">{d.languageCode}</p>
                </div>
              </div>
              <p className="list-text mb-0" dir={d.languageCode && d.languageCode.startsWith('ar') ? 'rtl' : 'ltr'}>
                {d.content}
              </p>
            </ListGroupItem>
          ))}
      </ListGroup>
    </ClientOnly>
  );
};
export default ProductDescPreview;
