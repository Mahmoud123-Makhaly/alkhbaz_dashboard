'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next-intl/client';
import { useTranslate, useAPIAuthClient, useToast } from '@app/hooks';
import { ICart, ICustomerItem } from '@app/types';
import { endpoints } from '@app/libs';
import { BreadCrumb, DataLoader, DataLoadingSkeletonType, DataLoadingStatus, EmptyTable } from '@components/common';
import React from 'react';
import ItemCard from './ItemCard';
import { Row, Col } from 'reactstrap';
import CartSummary from './CartSummary';

const CartDetails = ({ id }: { id: string }) => {
  const [dataLoadingStatus, setDataLoadingStatus] = useState<DataLoadingStatus>();
  const [cartDetails, setCartDetails] = useState<ICart>();
  const t = useTranslate('COMP_CART.DETAILS');
  const toast = useToast();
  const apiClient = useAPIAuthClient();
  const router = useRouter();

  const loadData = useCallback(() => {
    setDataLoadingStatus(DataLoadingStatus.pending);
    apiClient.select<ICart>(endpoints.carts.details, { urlParams: { id } }).then(
      (data: ICart) => {
        if (data && data.id === id) {
          setCartDetails(data);

          setTimeout(() => {
            setDataLoadingStatus(DataLoadingStatus.done);
          }, 600);
        } else {
          toast.error(t('ERR_NOT_FOUNDED'));
          setTimeout(() => {
            router.replace('/carts');
          }, 400);
        }
      },
      err => {
        toast.error(err.toString());
        setDataLoadingStatus(DataLoadingStatus.done);
      },
    );
  }, [apiClient, id, router, t, toast]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (cartDetails?.id && cartDetails?.customerId && !cartDetails.customerName) {
      apiClient.select<ICustomerItem>(endpoints.customers.details, { urlParams: { id: cartDetails?.customerId } }).then(
        (data: ICustomerItem) => {
          setCartDetails(prev => ({ ...prev, customerName: data?.fullName || t('GUEST') }) as ICart);
        },
        err => {
          toast.error(err.toString());
          setDataLoadingStatus(DataLoadingStatus.done);
        },
      );
    }
  }, [apiClient, cartDetails, router, t, toast]);

  return (
    <React.Fragment>
      <DataLoader status={dataLoadingStatus} skeleton={DataLoadingSkeletonType.card}>
        <BreadCrumb
          title={`${cartDetails?.customerName} - ${t('CART_HEADER_INFO')} (${cartDetails?.items.length || 0} ${t(
            'ITEMS',
          )})`}
          paths={[
            { label: t('CART_TITLE'), relativePath: '/carts' },
            {
              label: cartDetails?.name || t('CART_DETAILS'),
              relativePath: '',
              isActive: true,
            },
          ]}
        />
        <Row>
          {cartDetails?.items.length ? (
            <Col xl={8}>{cartDetails?.items.map(cartItem => <ItemCard data={cartItem} key={cartItem.id} />)}</Col>
          ) : (
            <Col>
              <EmptyTable message={t('NO_ITEMS')} />
            </Col>
          )}
          <Col xl={4}>
            <CartSummary data={cartDetails} />
          </Col>
        </Row>
      </DataLoader>
    </React.Fragment>
  );
};
export default CartDetails;
