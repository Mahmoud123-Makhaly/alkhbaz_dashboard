import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next-intl/link';
import {
  Card,
  CardBody,
  CardHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';

import { CompactTable } from '@components/common/widgets/compact-table';
import { ImageWithFallback } from '@components/common';
import { useTranslate, useToast } from '@app/hooks';
import { topSellers } from '@assets/data/velzon';
import NoImage from '@assets/img/no-image.png';

const TopSellers = () => {
  const [bestSellers, setBestSellers] = useState<{
    headers: Array<{ title: string; field: string }>;
    data?: Array<any>}>();
    const t = useTranslate('COMP_TopSales');

  const loadData = useCallback(() => {
    if (topSellers) {
      setBestSellers(prev => ({
        headers: [
          { title: '', field: 'img' },
          { title: '', field: 'product' },
          { title: '', field: 'stock' },
          { title: '', field: 'amount' },
          { title: '', field: 'percentage' },
        ],
        data: topSellers.map(item => ({
          ...item,
          img: (
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 me-2">
                <ImageWithFallback
                  src={item.img.src}
                  alt={item.label}
                  width={0}
                  height={0}
                  loading="lazy"
                  sizes="100vw"
                  style={{ height: 'auto' }}
                  className="avatar-sm p-2"
                  fallbackSrc={NoImage.src}
                />
              </div>
              <div>
                <h5 className="fs-14 my-1 fw-medium">
                  <Link href="/apps-ecommerce-seller-details" className="text-reset">
                    {item.label}
                  </Link>
                </h5>
                <span className="text-muted">{item.name}</span>
              </div>
            </div>
          ),
          percentage: (
            <h5 className="fs-14 mb-0">
              {item.percentage}%<i className="ri-bar-chart-fill text-success fs-16 align-middle ms-2"></i>
            </h5>
          ),
        })),
      }));
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Card className="h-100">
      <CardHeader className="align-items-center d-flex">
        <h4 className="card-title mb-0 flex-grow-1">{t('SALES')}</h4>
        <div className="flex-shrink-0">
          <UncontrolledDropdown className="card-header-dropdown" direction="start">
            <DropdownToggle tag="a" className="text-reset dropdown-btn" role="button">
              <span className="text-muted">
                Report<i className="mdi mdi-chevron-down ms-1"></i>
              </span>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu dropdown-menu-end">
              <DropdownItem>Download Report</DropdownItem>
              <DropdownItem>Export</DropdownItem>
              <DropdownItem>Import</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </CardHeader>

      <CardBody>
        {bestSellers && <CompactTable headers={bestSellers.headers} data={bestSellers?.data} hideHeader />}
      </CardBody>
    </Card>
  );
};

export default TopSellers;
