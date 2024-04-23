'use client';

import React from 'react';
import { IOrderItem } from '@app/types';
import NoImage from '@assets/img/no-image.png';
import Link from 'next-intl/link';
import { ImageWithFallback } from '@components/common';

const ItemCard = ({ product }: { product: IOrderItem }) => {
  return (
    <React.Fragment>
      <tr>
        <td>
          <div className="d-flex">
            <div className="flex-shrink-0 avatar-md bg-light rounded p-1">
              <ImageWithFallback
                src={product.imageUrl || NoImage.src}
                alt={product.name}
                className="avatar-sm rounded-2"
                width={0}
                height={0}
                loading="lazy"
                sizes="100vw"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '100%',
                }}
                fallbackSrc={NoImage.src}
              />
            </div>
            <div className="flex-grow-1 ms-3">
              <h5 className="fs-15">
                <Link href={`/products/${product.productId}?catalogId=${product.catalogId}`} className="link-primary">
                  {product.name}
                </Link>
              </h5>
            </div>
          </div>
        </td>
        <td>{product.placedPrice}</td>
        <td>{product.quantity}</td>
        <td>{product.sku}</td>
        <td>{product.taxType}</td>
        <td className="fw-medium text-end">{product.quantity * product.placedPrice}</td>
      </tr>
    </React.Fragment>
  );
};

export default ItemCard;
