'use client';

import Link from 'next-intl/link';
import Image from 'next/image';
import React from 'react';
import moment from 'moment';

const ProductReview = ({
  rating,
  comment,
  username,
  date,
}: {
  rating?: string;
  comment: string;
  username?: string;
  date?: Date;
}) => {
  return (
    <React.Fragment>
      <li className="py-2">
        <div className="border border-dashed rounded p-3">
          <div className="d-flex align-items-start mb-3">
            <div className="hstack gap-3">
              <div className="badge rounded-pill bg-success mb-0">
                <i className="mdi mdi-star"></i> {rating || '0'}
              </div>
              <div className="vr"></div>
              <div className="flex-grow-1">
                <p className="text-muted mb-0">{comment}</p>
              </div>
            </div>
          </div>
          {/* {props.review.subItems && (
            <React.Fragment>
              <div className="d-flex flex-grow-1 gap-2 mb-3">
                {props.review.subItems.map((subItem, key) => (
                  <React.Fragment key={key}>
                    <Link href="#" className="d-block">
                      <Image src={subItem.img.src} alt="" className="avatar-sm rounded object-cover" />
                    </Link>
                  </React.Fragment>
                ))}
              </div>
            </React.Fragment>
          )} */}

          <div className="d-flex align-items-end">
            <div className="flex-grow-1">
              <h5 className="fs-14 mb-0">{username || ''}</h5>
            </div>

            <div className="flex-shrink-0">
              <p className="text-muted fs-13 mb-0">{date ? moment(date).format('DD, MMM yyyy') : ''}</p>
            </div>
          </div>
        </div>
      </li>
    </React.Fragment>
  );
};
export default ProductReview;
