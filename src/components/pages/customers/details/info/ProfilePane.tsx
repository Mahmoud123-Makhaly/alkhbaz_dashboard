'user client';

import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Image from 'next/image';

import { useTranslate } from '@app/hooks';
import { ICustomerItem, ILookupOption } from '@app/types';
import { useLookup } from '@app/hooks';
import { organizationLookup } from '@app/libs';
import { DefaultLangCode } from '@helpers/constants';
import { Utils } from '@helpers/utils';
const CustomerProfilePane = ({ data }: { data: ICustomerItem | null }) => {
  const [organizationsList, setOrganizationsList] = useState<Array<ILookupOption> | null>(null);
  const t = useTranslate('COMP_CustomerDetails.INFO');
  const lookups = useLookup([organizationLookup]);

  useEffect(() => {
    lookups.load().then(
      data => setOrganizationsList(data.organizations),
      error => console.log(error),
    );
  }, []);
  return (
    <div className="table-responsive">
      <table className="table mb-0">
        <tbody>
          <tr>
            <th scope="row" style={{ width: '200px' }}>
              {t('TITLE_LABEL')}
            </th>
            <td>{data?.salutation ? data.salutation : t('N/A')}</td>
          </tr>
          <tr>
            <th scope="row">{t('BIRTH_DATE_LABEL')}</th>
            <td>{data?.birthDate ? moment(data?.birthDate).format('DD, MMM yyyy') : t('N/A')}</td>
          </tr>
          <tr>
            <th scope="row">{t('GROUPS_LABEL')}</th>
            <td>
              {data?.groups && data?.groups.length > 0
                ? data?.groups.map((g, indx) => (
                    <div key={`customer-group-${indx}`} className="badge fw-medium badge-soft-info me-1">
                      {g}
                    </div>
                  ))
                : t('N/A')}
            </td>
          </tr>
          {organizationsList && (
            <React.Fragment>
              <tr>
                <th scope="row">{t('ASSOCIATED_COMPANIES_LABEL')}</th>
                <td>
                  {data?.associatedOrganizations && data?.associatedOrganizations.length > 0
                    ? data?.associatedOrganizations.map((org, indx) => (
                        <div key={`customer-group-${indx}`} className="badge fw-medium badge-soft-info me-1">
                          {organizationsList.find(x => x.value === org)?.label}
                        </div>
                      ))
                    : t('N/A')}
                </td>
              </tr>
              <tr>
                <th scope="row">{t('MEMBER_OF_LABEL')}</th>
                <td>
                  {data?.organizations && data?.organizations.length > 0
                    ? data?.organizations.map((org, indx) => (
                        <div key={`customer-group-${indx}`} className="badge fw-medium badge-soft-info me-1">
                          {organizationsList.find(x => x.value === org)?.label}
                        </div>
                      ))
                    : t('N/A')}
                </td>
              </tr>
            </React.Fragment>
          )}
          <tr>
            <th scope="row">{t('TIME_ZONE_LABEL')}</th>
            <td>{data?.timeZone ? data?.timeZone : t('N/A')}</td>
          </tr>
          <tr>
            <th scope="row">{t('DEFAULT_LANG_LABEL')}</th>
            <td>
              <div className="avatar-xxs rounded-circle">
                <Image
                  src={
                    data?.defaultLanguage
                      ? Utils.getFlagByLangCode(data?.defaultLanguage).src
                      : Utils.getFlagByLangCode(DefaultLangCode)
                  }
                  alt={data?.defaultLanguage || DefaultLangCode}
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
            </td>
          </tr>
          <tr>
            <th scope="row">{t('TAX_PAYER_ID_LABEL')}</th>
            <td>{data?.taxPayerId ? data?.taxPayerId : t('N/A')}</td>
          </tr>
          <tr>
            <th scope="row">{t('PREFERRED_COMMUNICATION_LABEL')}</th>
            <td>{data?.preferredCommunication ? data?.preferredCommunication : t('N/A')}</td>
          </tr>
          <tr>
            <th scope="row">{t('PREFERRED_DELIVER_METHOD_LABEL')}</th>
            <td>{data?.preferredDelivery ? data?.preferredDelivery : t('N/A')}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default CustomerProfilePane;
