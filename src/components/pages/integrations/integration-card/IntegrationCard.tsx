'use client';

import { useCallback, useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { ICardData } from './IntegrationCard.types';
import { Utils } from '@helpers/utils';
import { useToast, useTranslate, useAPIAuthClient } from '@app/hooks';
import './IntegrationCard.css';

const IntegrationCard = () => {
  const [configurations, setConfigurations] = useState<ICardData>([]);
  const locale = useLocale();
  const t = useTranslate('COMP_IntegrationCard');
  const toast = useToast();
  const apiClient = useAPIAuthClient();

  const setStatus = (id: string, status: 'mounted' | 'sync' | 'success' | 'danger', response?: []) => {
    const revisedConfigurations = [...configurations];
    configurations.find(x => x.id === id)!.status = status;
    if (response) configurations.find(x => x.id === id)!.response = response;
    setConfigurations(revisedConfigurations);
  };

  const sync = (id: string) => {
    setStatus(id, 'sync');
    apiClient
      .select(configurations.find(x => x.id === id)!.endpoint)
      .then(
        data => {
          if (data) {
            setStatus(id, 'success', data);
          } else if (data === undefined) setStatus(id, 'danger');
        },
        err => {
          toast.error(t('ERR_GENERIC_MSG', { trace: process.env.NODE_ENV === 'development' ? err : '' }));
          setStatus(id, 'danger');
        },
      )
      .catch(reason => {
        toast.error(t('ERR_GENERIC_MSG', { trace: process.env.NODE_ENV === 'development' ? reason : '' }));
        setStatus(id, 'danger');
      });
  };

  const loadData = useCallback(() => {
    Utils.loadJSON('/data/DataIntegrationConfig')
      .then(
        resp => {
          if (resp && resp.length > 0) {
            const revisedConfigurations: ICardData = resp.map(item => Object.assign(item, { status: 'mounted' }));
            setConfigurations(revisedConfigurations);
          }
        },
        err => toast.error(t('ERR_GENERIC_MSG', { trace: process.env.NODE_ENV === 'development' ? err : '' })),
      )
      .catch(reason =>
        toast.error(t('ERR_GENERIC_MSG', { trace: process.env.NODE_ENV === 'development' ? reason : '' })),
      );
  }, [t, toast]);

  useEffect(() => loadData(), []);

  return (
    <Row>
      {(configurations || []).map((item, key) => (
        <Col key={key} sm={6} md={6} lg={6} xl={3}>
          <Card className="ribbon-box right overflow-hidden" style={{ height: '255px' }}>
            <CardBody className="text-center p-4">
              {(item.status === 'danger' || item.status === 'success') && (
                <div className={`ribbon ribbon-${item.status} ribbon-shape`}>
                  <i
                    className={`ri-${
                      item.status === 'success' ? 'check' : 'close'
                    }-fill text-white align-bottom me-1 fs-13`}
                  ></i>
                  <span className="trending-ribbon-text">{t(`RIBBON_${item.status.toLocaleUpperCase()}`)}</span>
                </div>
              )}
              <Image src={item.img} width={60} height={60} alt={item.label[locale]} loading="lazy" />
              <h5 className="text-primary mb-1 mt-4">{item.label[locale]}</h5>
              {(item.status === 'sync' || item.status === 'danger' || item.status === 'success') && (
                <p className="text-muted my-3">
                  {item.status === 'sync'
                    ? t('SYNC_MSG')
                    : item.status === 'success'
                    ? item.successMsgs[locale].replace('{count}', item.response?.length || 0)
                    : item.failedMsgs[locale]}
                </p>
              )}
              {item.status === 'mounted' && <p className="text-muted my-3">&nbsp;&nbsp;</p>}
              <div className={`mt-4${item.status === 'sync' || item.status === 'success' ? ' disabled' : ''}`}>
                <Button
                  color={item.status === 'success' ? item.status : 'primary'}
                  className="w-50"
                  onClick={() => sync(item.id)}
                >
                  {item.status != 'success' && (
                    <i className={`mdi${item.status === 'sync' ? ' mdi-spin' : ''} mdi-rotate-3d-variant me-2`}></i>
                  )}
                  {t(`SYNC_BTN_${item.status === 'sync' ? 'MOUNTED' : item.status.toLocaleUpperCase()}_LABEL`)}
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
export default IntegrationCard;
