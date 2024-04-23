import React from 'react';
import { useTranslate } from '@app/hooks';
import { ICartItem } from '@app/types';
import NoImage from '@assets/img/no-image.png';
import { ImageWithFallback } from '@components/common';
import { Card, CardBody, Row, Input, CardFooter } from 'reactstrap';
import Link from 'next-intl/link';

const ItemCard = ({ data }: { data: ICartItem | undefined }) => {
  const t = useTranslate('COMP_CART.DETAILS');

  return (
    <Card className="product mb-2">
      <CardBody>
        <Row className="gy-3">
          <div className="col-sm-auto">
            <div className="avatar  rounded p-1">
              <div className="flex-shrink-0 avatar-lg  rounded ">
                <ImageWithFallback
                  src={data?.imageUrl || NoImage.src}
                  alt={data!.name}
                  className="avatar-sm rounded-2"
                  width={0}
                  height={0}
                  loading="lazy"
                  sizes="100vw"
                  style={{
                    width: '100%',
                    height: '100%',
                    maxHeight: '100%',
                  }}
                  fallbackSrc={NoImage.src}
                />
              </div>
            </div>
          </div>
          <div className="col-sm">
            <h5 className="fs-16 text-truncate">
              <Link href={`/products/${data?.productId}?catalogId=${data?.catalogId}`}>{data?.name}</Link>
            </h5>

            <div className="input-step">
              {/* <button
                             type="button"
                             className="minus"
                             onClick={() => {
                               countDown(cartItem.id, cartItem.data_attr, cartItem.price);
                             }}
                           >
                             –
                           </button> */}
              <Input type="text" className="product-quantity" value={data?.quantity} name="demo_vertical" readOnly />
              {/* <button
                             type="button"
                             className="plus"
                             onClick={() => {
                               countUP(cartItem.id, cartItem.data_attr, cartItem.price);
                             }}
                           >
                             +
                           </button> */}
            </div>
          </div>
          <div className="col-sm-auto">
            <div className="text-lg-end ">
              <p className="text-muted mb-1">{t('ITEM_PRICE')}</p>

              <h5 className="fs-14 me-1">
                {data?.currency}
                <span id="ticket_price" className="product-price fs-14">
                  {' '}
                  {data?.listPrice}
                </span>
              </h5>
            </div>
          </div>
        </Row>
      </CardBody>
      <CardFooter>
        <div className="row align-items-center gy-3">
          <div className="col-sm">
            <div className="d-flex flex-wrap my-n1 ">
              <div className="me-3">
                {t('TAX_TYPES')} {data?.taxType}
              </div>
              <div className="me-3">
                {t('DISCOUNT_AMOUNT')} {data?.discountAmount}
              </div>
              <div>
                {t('SKU')} {data?.sku}
              </div>
            </div>
          </div>
          <div className="col-sm-auto">
            <div className="d-flex align-items-center gap-2 text-muted">
              <div>{t('TOTAL')}</div>
              <h5 className="fs-14 mb-0">
                {data?.currency}
                <span className="product-line-price">{` ${(data!.listPrice * data!.quantity).toFixed(2)}`}</span>
              </h5>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
