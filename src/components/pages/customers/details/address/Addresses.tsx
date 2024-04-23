'use client';

import React, { useState } from 'react';

import { useTranslate } from '@app/hooks';

import withCustomerDetails, { IWithCustomerDetailsProps } from '../CustomerDetails.hoc';
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from 'reactstrap';
import EmptyAddresses from './EmptyAddresses';
import { DeleteModal, EndSideBar, DataLoadingStatus } from '@components/common';
import { endpoints } from '@app/libs';
import AddressBasicForm from './AddressBasicForm';
import _ from 'lodash';
import { IAddress } from '@app/types';

import FeatherIcon from 'feather-icons-react';
const CustomerAddress = ({
  id,
  data,
  toast,
  apiClient,
  dataLoadingStatus,
  setDataLoadingStatus,
  loadData,
}: IWithCustomerDetailsProps) => {
  const t = useTranslate('COMP_CustomerDetails.ADDRESSES');
  const [modalMode, setModalMode] = useState<'new' | 'edit' | null>(null);
  const [modalHeader, setModalHeader] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [deleteModal, setDeleteModal] = useState(false);
  const modalToggle = (mode: 'new' | 'edit' | null) => {
    if (mode === 'new') setSelectedId(id);
    setModalMode(mode);
    setModalHeader(t(mode === 'edit' ? 'EDIT_ADDRESS' : 'ADD_ADDRESS'));
  };
  const handleFormSubmit = (): void => {
    modalToggle(null);
    loadData();
  };
  const handleOnEdit = (key: IAddress) => {
    setSelectedId(key?.key);
    modalToggle('edit');
  };

  const handleOnDelete = (key: string) => {
    setSelectedId(key);
    setDeleteModal(true);
  };
  const handleDelete = (): void => {
    setDeleteModal(false);
    setDataLoadingStatus(DataLoadingStatus.pending);
    const address = data?.addresses || [];
    _.remove(address, (item: IAddress) => item.key === selectedId);
    apiClient.update(endpoints.customers.update, { ...data, addresses: address }).then(
      data => {
        if (data) {
          setSelectedId(undefined);
          setTimeout(() => {
            toast.success(t('DELETE_ADDRESS_SUCCESS_MSG'));
            loadData();
          }, 300);
        } else {
          setDataLoadingStatus(DataLoadingStatus.done);
          toast.error(t('ERR_DELETE_ADDRESS_MSG'));
        }
      },
      err => {
        setSelectedId(undefined);
        toast.error(err.toString());
        setDataLoadingStatus(DataLoadingStatus.done);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
  return (
    <React.Fragment>
      <DeleteModal show={deleteModal} onDeleteClick={() => handleDelete()} onCloseClick={() => setDeleteModal(false)} />
      <Row className="mb-3">
        <Col md={12} className="text-end">
          <Button color="primary" type="button" onClick={() => modalToggle('new')}>
            <i className="ri-add-fill me-1 align-bottom"></i> {t('NEW')}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          {data?.addresses[0] ? (
            <Row className="g-3">
              {data?.addresses.map((address, key) => (
                <Col xxl={4} key={key}>
                  <div className="card ribbon-box border shadow-none mb-lg-0 right h-100">
                    <div className="card-body text-muted">
                      <Row>
                        {/* addressType */}
                        <Col xxl={8} className="d-flex align-items-center">
                          <i className=" ri-truck-fill fs-2 text-primary" />
                          <h5 className="m-0 ms-2">
                            {address.addressType && address.addressType != 'Undefined' ? address.addressType : ''}
                          </h5>
                        </Col>
                        {/* Edit + Remove */}
                        <Col xxl={4} className={address.isDefault ? 'text-end pe-5' : 'text-end'}>
                          <UncontrolledDropdown direction="end" className="text-end" style={{ zIndex: 2 }}>
                            <DropdownToggle
                              tag="button"
                              className="btn btn-link text-muted p-1 mt-n2 py-0 text-decoration-none fs-15"
                            >
                              <FeatherIcon icon="more-horizontal" className="icon-sm" />
                            </DropdownToggle>

                            <DropdownMenu className="dropdown-menu-end">
                              <DropdownItem onClick={() => handleOnEdit(address)}>
                                <i className="ri-pencil-fill align-bottom me-2 text-muted"></i> {t('EDIT')}
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => handleOnDelete(address.key!)}
                                data-bs-toggle="modal"
                                data-bs-target="#removeProjectModal"
                              >
                                <i className="ri-delete-bin-fill align-bottom me-2 text-danger"></i> {t('DELETE')}
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </Col>
                      </Row>
                      {/* show default shape on card if address default == true */}
                      {address.isDefault && (
                        <div className="ribbon-two ribbon-two-primary">
                          <span>{t('DEFAULT_LABEL')}</span>
                        </div>
                      )}
                      <Row>
                        <ul className="list-unstyled mb-1">
                          {/* First name + middle name + last name */}
                          <li className="mb-1">
                            <i className="ri-user-2-fill text-primary me-1"></i>
                            {address.firstName} {address.middleName} {address.lastName}
                          </li>
                          {/* organization */}
                          <li className="mb-1">
                            <i className="ri-government-fill text-primary me-1"></i>
                            {address.organization ? address.organization : t('N/A')}
                          </li>
                          {/* countryCode, countryName, city, regionName */}
                          <li className="mb-1">
                            <i className="ri-earth-fill text-primary me-1"></i>
                            {address.countryCode ?? ''}, {address.countryName ?? ''}, {address.city ?? ''},
                            {address.regionName ?? ''}
                          </li>
                          {/* postalCode */}
                          <li className="mb-1">
                            <i className="mdi mdi-mailbox text-primary me-1"></i>
                            {address.postalCode ? address.postalCode : t('N/A')}
                          </li>
                          {/* zip */}
                          <li className="mb-1">
                            <i className="ri-map-pin-user-fill text-primary me-1"></i>
                            {address.zip ? address.zip : t('N/A')}
                          </li>
                          {/* line1 */}
                          <li className="mb-1">
                            <i className="ri-takeaway-fill text-primary me-1"></i>
                            {address.line1 ? address.line1 : t('N/A')}
                          </li>
                          {/* line2 */}
                          <li className="mb-1">
                            <i className="ri-takeaway-fill text-primary me-1"></i>
                            {address.line2 ? address.line2 : t('N/A')}
                          </li>
                          {/* phone */}
                          <li className="mb-1">
                            <i className="ri-phone-fill text-success me-1"></i>
                            {address.phone ? address.phone : t('N/A')}
                          </li>
                          {/* email */}
                          <li className="mb-1">
                            <i className="ri-mail-fill text-secondary me-1"></i>
                            {address.email ? address.email : t('N/A')}
                          </li>
                          {/* description */}
                          <li>
                            <i className="ri-information-fill text-primary me-1"></i>
                            {address.description ? address.description : t('N/A')}
                          </li>
                        </ul>
                      </Row>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <EmptyAddresses />
          )}
        </Col>
      </Row>
      <EndSideBar isOpen={!!modalMode} title={modalHeader} toggle={() => modalToggle(null)}>
        <AddressBasicForm
          mode={modalMode}
          onCancel={() => modalToggle(null)}
          onSubmit={handleFormSubmit}
          id={selectedId}
          data={data}
        />
      </EndSideBar>
    </React.Fragment>
  );
};

export default withCustomerDetails(CustomerAddress);
