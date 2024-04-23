'user client';

import { useRouter } from 'next-intl/client';
import { useState } from 'react';
import { endpoints } from '@app/libs';
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  ButtonGroup,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import classnames from 'classnames';
import { ImageWithFallback } from '@components/common';
import SimpleBar from 'simplebar-react';

import { useTranslate } from '@app/hooks';
import { ClientOnly, DeleteModal, DataLoadingStatus, EndSideBar } from '@components/common';
import { AddUserBasicForm, CustomerBasicForm } from '@components/pages';
import NoImage from '@assets/img/users/user-dummy-img.jpg';

import withCustomerDetails, { IWithCustomerDetailsProps } from '../CustomerDetails.hoc';
import CustomerBasicInfo from './Basic';
import CustomerProfilePane from './ProfilePane';
import EmailsList from './EmailsList';
import PhonesList from './PhonesList';
import React from 'react';
import SecurityPane from './SecurityPane';
import CustomerEmailBasicForm from './touch-points/CustomerEmailBasicForm';
import CustomerPhoneBasicForm from './touch-points/CustomerPhoneBasicForm';
import AddressBasicForm from '../address/AddressBasicForm';

const CustomerInfo = ({
  id,
  data,
  toast,
  apiClient,
  dataLoadingStatus,
  setDataLoadingStatus,
  loadData,
}: IWithCustomerDetailsProps) => {
  const [customActiveTab, setCustomActiveTab] = useState('1');
  const [deleteModal, setDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState<{
    mode: 'new' | 'edit' | null;
    form?: 'details' | 'email' | 'phone' | 'address' | 'account';
    header?: string;
    key?: any;
    width?: string;
  }>({
    mode: null,
  });
  const t = useTranslate('COMP_CustomerDetails.INFO');
  const router = useRouter();

  const tabs = [
    {
      id: '1',
      key: '',
      title: t('TAB_HEADER_PORTFOLIO'),
      comp: <CustomerProfilePane data={data} />,
    },
    {
      id: '2',
      key: 'emails',
      title: t('TAB_HEADER_EMAILS'),
      comp: (
        <EmailsList
          data={data || null}
          apiClient={apiClient}
          dataLoadingStatus={dataLoadingStatus}
          toast={toast}
          setDataLoadingStatus={setDataLoadingStatus}
          loadData={loadData}
          id={id}
        />
      ),
    },
    {
      id: '3',
      key: 'phones',
      title: t('TAB_HEADER_PHONES'),
      comp: (
        <PhonesList
          data={data || null}
          apiClient={apiClient}
          dataLoadingStatus={dataLoadingStatus}
          toast={toast}
          setDataLoadingStatus={setDataLoadingStatus}
          loadData={loadData}
          id={id}
        />
      ),
    },
    {
      id: '4',
      key: 'securityAccounts',
      title: t('TAB_HEADER_SECURITY'),
      comp: (
        <SecurityPane
          data={data || null}
          apiClient={apiClient}
          dataLoadingStatus={dataLoadingStatus}
          toast={toast}
          setDataLoadingStatus={setDataLoadingStatus}
          loadData={loadData}
          id={id}
        />
      ),
    },
  ];
  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setCustomActiveTab(tab);
    }
  };
  const onHandleDelete = () => {
    setDeleteModal(true);
  };

  const handleDelete = (): void => {
    setDeleteModal(false);
    setDataLoadingStatus(DataLoadingStatus.pending);
    apiClient.delete(endpoints.customers.delete, { ids: id }).then(
      data => {
        if (data && data.status === 204) {
          toast.success(t('DELETE_SUCCESS_MSG'));
          setTimeout(() => {
            router.replace('/customers');
          }, 500);
        } else {
          setDataLoadingStatus(DataLoadingStatus.done);
          toast.error(t('ERR_DELETE_MSG'));
        }
      },
      err => {
        toast.error(err.toString());
        setDataLoadingStatus(DataLoadingStatus.done);
      },
    );
  };

  const closeModel = (): void => {
    setModalMode({ mode: null });
  };

  const modalToggle = (form?: 'details' | 'email' | 'phone' | 'address' | 'account', header?: string) => {
    switch (form) {
      case 'email':
        setModalMode({ mode: 'new', form, header: t('ADD_EMAIL'), key: data });
        break;
      case 'phone':
        setModalMode({ mode: 'new', form, header: t('ADD_PHONE'), key: data });
        break;
      case 'details':
        setModalMode({ mode: 'edit', form, header: t('EDIT_CUSTOMER'), key: data, width: '40%' });
        break;
      case 'account':
        setModalMode({ mode: 'new', form, header: t('ADD_CUSTOMER_ACCOUNT'), key: data?.id });
        break;
      case 'address':
        setModalMode({ mode: 'new', form, header: t('ADD_ADDRESS'), key: data });
        break;
      default:
        setModalMode({ mode: null });
        break;
    }
  };

  return (
    <ClientOnly>
      <DeleteModal show={deleteModal} onDeleteClick={() => handleDelete()} onCloseClick={() => setDeleteModal(false)} />
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <Row className="gx-lg-5">
                <Col xl={4} md={8} className="mx-auto">
                  <Card className="border card-border-muted">
                    <CardBody className="ribbon-box right shadow-none overflow-hidden text-center">
                      {data?.outerId && (
                        <div className="ribbon ribbon-info ribbon-shape trending-ribbon">
                          <i className="ri-flashlight-fill text-white align-bottom float-start me-1"></i>
                          <span className="trending-ribbon-text">{t('SYNCED')}</span>
                        </div>
                      )}
                      <div className="position-relative d-inline-block">
                        <ImageWithFallback
                          className="avatar-lg rounded-circle img-thumbnail"
                          src={data?.iconUrl ? data?.iconUrl : NoImage.src}
                          width={0}
                          height={0}
                          alt={data?.fullName || 'customer'}
                          loading="lazy"
                          sizes="100vw"
                          style={{ height: 'auto' }}
                          fallbackSrc={NoImage.src}
                        />
                        <span className="contact-active position-absolute rounded-circle bg-success">
                          <span className="visually-hidden"></span>
                        </span>
                      </div>
                      <h5 className="mt-4 mb-3">{data?.fullName}</h5>

                      <ul className="list-inline mb-0">
                        {data && data.phones && data.phones.length > 0 && (
                          <li className="list-inline-item avatar-xs">
                            <a
                              href={`tel:${data.phones[0]}`}
                              className="avatar-title bg-soft-success text-success fs-15 rounded"
                            >
                              <i className="ri-phone-line"></i>
                            </a>
                          </li>
                        )}
                        {data && data.emails && data.emails.length > 0 && (
                          <li className="list-inline-item avatar-xs">
                            <a
                              href={`mailto:${data.emails[0]}`}
                              className="avatar-title bg-soft-secondary text-primary fs-15 rounded"
                            >
                              <i className="ri-at-line"></i>
                            </a>
                          </li>
                        )}
                        <li className="list-inline-item avatar-xs">
                          <Button
                            color="danger"
                            className="avatar-title bg-white text-danger fs-15 rounded"
                            outline
                            onClick={onHandleDelete}
                          >
                            <i className="ri-delete-bin-fill align-bottom"></i>
                          </Button>
                        </li>
                        <li className="list-inline-item avatar-xs">
                          <Button
                            color="light"
                            className="avatar-title bg-white text-muted fs-15 rounded"
                            outline
                            onClick={() => modalToggle('details')}
                          >
                            <i className="ri-pencil-fill align-bottom"></i>
                          </Button>
                        </li>
                        <li className="list-inline-item avatar-xs">
                          <ButtonGroup className="mb-1">
                            <UncontrolledDropdown>
                              <DropdownToggle tag="a" role="button" className="btn btn-primary btn-sm fs-12 rounded">
                                <i className="ri-add-fill"></i>
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem onClick={() => modalToggle('email')}>
                                  <i className="ri-at-line align-bottom me-1 text-primary"></i>
                                  {t('ADD_BTN_LABEL_EMAIL')}
                                </DropdownItem>
                                <DropdownItem onClick={() => modalToggle('phone')}>
                                  <i className="ri-phone-line align-bottom me-1 text-success"></i>
                                  {t('ADD_BTN_LABEL_PHONE')}
                                </DropdownItem>
                                <DropdownItem onClick={() => modalToggle('address')}>
                                  <i className="ri-earth-line align-bottom me-1 text-info"></i>
                                  {t('ADD_BTN_LABEL_ADDRESS')}
                                </DropdownItem>
                                {!data?.securityAccounts ||
                                  (data?.securityAccounts.length <= 0 && (
                                    <DropdownItem onClick={() => modalToggle('account')}>
                                      <i className="ri-fingerprint-line align-bottom me-1 text-secondary"></i>
                                      {t('ADD_BTN_LABEL_ACCOUNT')}
                                    </DropdownItem>
                                  ))}
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </ButtonGroup>
                        </li>
                      </ul>
                    </CardBody>
                    <CardBody className="p-4">
                      <CustomerBasicInfo data={data} />
                    </CardBody>
                  </Card>
                </Col>
                <Col xl={8}>
                  <Nav tabs className="nav-tabs-custom nav-success">
                    {tabs.map(elem => {
                      if (
                        elem.key === '' ||
                        (data && data[elem.key] && Array.isArray(data[elem.key]) && data[elem.key].length > 0)
                      )
                        return (
                          <NavItem key={'prod-tab-' + elem.id}>
                            <NavLink
                              style={{ cursor: 'pointer' }}
                              className={classnames({ active: customActiveTab === elem.id })}
                              onClick={() => {
                                toggleCustom(elem.id);
                              }}
                            >
                              {elem.title}
                            </NavLink>
                          </NavItem>
                        );
                      else return <React.Fragment key={elem.id}></React.Fragment>;
                    })}
                  </Nav>
                  <SimpleBar className="simplebar-track-info me-lg-n3 pe-lg-4" style={{ minHeight: '400px' }}>
                    <TabContent activeTab={customActiveTab} className="border border-top-0 p-4" id="nav-tabContent">
                      {tabs.map(elem => {
                        if (
                          elem.key === '' ||
                          (data && data[elem.key] && Array.isArray(data[elem.key]) && data[elem.key].length > 0)
                        )
                          return (
                            <TabPane id="nav-speci" tabId={elem.id}>
                              {elem.comp}
                            </TabPane>
                          );
                        else return <React.Fragment key={elem.id}></React.Fragment>;
                      })}
                    </TabContent>
                  </SimpleBar>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <EndSideBar isOpen={!!modalMode.mode} title={modalMode.header || ''} toggle={closeModel} width={modalMode.width}>
        {modalMode.mode && data && (
          <React.Fragment>
            {modalMode.form === 'email' && (
              <CustomerEmailBasicForm
                mode={modalMode.mode}
                onCancel={closeModel}
                onSubmit={loadData}
                data={modalMode.key}
              />
            )}
            {modalMode.form === 'phone' && (
              <CustomerPhoneBasicForm
                mode={modalMode.mode}
                onCancel={closeModel}
                onSubmit={loadData}
                data={modalMode.key}
              />
            )}
            {modalMode.form === 'details' && (
              <CustomerBasicForm
                mode={modalMode.mode}
                onCancel={closeModel}
                onSubmit={loadData}
                data={modalMode.key}
                id={id}
              />
            )}
            {modalMode.form === 'account' && (
              <AddUserBasicForm onCancel={closeModel} onSubmit={loadData} memberId={modalMode.key} />
            )}
            {modalMode.form === 'address' && (
              <AddressBasicForm mode={modalMode.mode} onCancel={closeModel} onSubmit={loadData} data={modalMode.key} />
            )}
          </React.Fragment>
        )}
      </EndSideBar>
    </ClientOnly>
  );
};
export default withCustomerDetails(CustomerInfo);
