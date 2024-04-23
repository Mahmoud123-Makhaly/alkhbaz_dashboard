'user client';

import React from 'react';
import { Table } from 'reactstrap';
import moment from 'moment';

import { useTranslate } from '@app/hooks';
import { ICustomerItem } from '@app/types';
const CustomerBasicInfo = ({ data }: { data: ICustomerItem | null }) => {
  const t = useTranslate('COMP_CustomerDetails.INFO');
  const status = (status: string) => {
    switch (status) {
      case 'Deleted':
        return <span className="badge text-uppercase badge-soft-warning"> {status} </span>;
      case 'Rejected':
        return <span className="badge text-uppercase badge-soft-danger"> {status} </span>;
      case 'New':
        return <span className="badge text-uppercase badge-soft-primary"> {status} </span>;
      case 'Approved':
        return <span className="badge text-uppercase badge-soft-success"> {status} </span>;
      default:
        return t('N/A');
    }
  };

  return (
    <React.Fragment>
      {data?.about && (
        <React.Fragment>
          <h6 className="text-muted text-uppercase fw-semibold mb-3">{t('ABOUT_LABEL')}</h6>
          <p className="text-muted mb-4">{data.about}</p>
        </React.Fragment>
      )}
      <div className="table-responsive table-card">
        <Table className="table table-borderless mb-0">
          <tbody>
            <tr>
              <td className="fw-medium">{t('FIRST_NAME_LABEL')}</td>
              <td>{data?.firstName}</td>
            </tr>
            <tr>
              <td className="fw-medium">{t('LAST_NAME_LABEL')}</td>
              <td>{data?.lastName}</td>
            </tr>
            <tr>
              <td className="fw-medium">{t('STATUS_LABEL')}</td>
              <td>{status(data?.status || '')}</td>
            </tr>
            <tr>
              <td className="fw-medium">{t('CREATED_LABEL')}</td>
              <td>{moment(data?.createdDate).format('DD, MMM yyyy')}</td>
            </tr>
            <tr>
              <td className="fw-medium">{t('MODIFIED_LABEL')}</td>
              <td>{moment(data?.modifiedDate).format('DD, MMM yyyy')}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </React.Fragment>
  );
};
export default CustomerBasicInfo;
