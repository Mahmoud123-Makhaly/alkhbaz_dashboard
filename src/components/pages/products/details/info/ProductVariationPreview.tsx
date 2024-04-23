'use client';

import { useState } from 'react';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { ImageWithFallback } from '@components/common';
import { useRouter } from 'next-intl/client';
import moment from 'moment';
import { ToastContent } from 'react-toastify';
import { IProductDetails } from '@app/types';
import { ClientOnly, DataLoadingStatus, DeleteModal } from '@components/common';
import { IApiAPPClient, endpoints } from '@app/libs';
import { useTranslate } from '@app/hooks';
import NoImage from '@assets/img/no-image.png';

const ProductVariationPreview = ({
  apiClient,
  data,
  toast,
  setDataLoadingStatus,
  loadData,
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
}) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletedVariationProdId, setDeletedVariationProdId] = useState<string | null>(null);
  const t = useTranslate('COMP_ProductVariationPreview');
  const router = useRouter();

  const handleDelete = (): void => {
    if (deletedVariationProdId) {
      setDeleteModal(false);
      setDataLoadingStatus(DataLoadingStatus.pending);
      apiClient.delete(endpoints.products.delete, { ids: deletedVariationProdId }).then(
        data => {
          if (data) {
            setTimeout(() => {
              toast.success(t('DELETE_VARIATION_SUCCESS_MSG'));
              loadData();
            }, 300);
          } else {
            setDataLoadingStatus(DataLoadingStatus.done);
            toast.error(t('ERR_DELETE_VARIATION_MSG'));
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
        {data?.info?.variations &&
          data?.info?.variations.map((d, indx) => (
            <ListGroupItem key={'prod-variant-' + indx} tag="a" to="#" className="list-group-item-action">
              <div className="float-end">
                <Button
                  color="danger"
                  outline
                  onClick={() => {
                    setDeleteModal(true);
                    setDeletedVariationProdId(d.id || null);
                  }}
                >
                  <i className="ri-delete-bin-fill align-bottom"></i>
                </Button>
              </div>
              <div className="float-end mx-1">
                <Button
                  color="primary"
                  outline
                  onClick={() => router.push(`/products/${d.id}?catalogId=${d.catalogId}`)}
                >
                  <i className=" ri-eye-fill align-bottom"></i>
                </Button>
              </div>
              <div className="d-flex mb-2 align-items-center">
                <div className="flex-shrink-0 avatar-sm rounded-circle">
                  <ImageWithFallback
                    src={d.imgSrc || NoImage.src}
                    alt={d.name}
                    className="avatar-sm rounded-2"
                    width={0}
                    height={0}
                    loading="lazy"
                    sizes="100vw"
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                    fallbackSrc={NoImage.src}
                  />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5 className="list-title fs-15 mb-1">{d.name}</h5>
                  <p className="list-text mb-0 fs-12">{moment(d.createdDate).format('DD, MMM yyyy')}</p>
                </div>
              </div>
            </ListGroupItem>
          ))}
      </ListGroup>
    </ClientOnly>
  );
};
export default ProductVariationPreview;
