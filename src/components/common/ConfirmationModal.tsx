'use client';

import React from 'react';
import { Modal, ModalBody, ModalHeader, Spinner } from 'reactstrap';
import { useTranslate } from '@app/hooks';

const ConfirmationModal = ({
  show,
  isLoading,
  header,
  msg,
  iconClass,
  submitBtnLabel,
  cancelBtnLabel,
  onSubmit,
  onCancel,
}: {
  show: boolean;
  isLoading: boolean;
  header: string;
  msg?: string;
  iconClass?: string;
  submitBtnLabel?: string;
  cancelBtnLabel?: string;
  onSubmit: () => void;
  onCancel: () => void;
}) => {
  const t = useTranslate('COMP_ConfirmationModal');
  return (
    <Modal isOpen={show} centered={true}>
      <ModalHeader>{header}</ModalHeader>
      <ModalBody className="px-5 pt-1">
        {!isLoading && (
          <React.Fragment>
            {(iconClass || msg) && (
              <div className="text-center">
                <div className="fs-15 mx-4 mx-sm-5">
                  {iconClass && <i className={`${iconClass} fs-48`}></i>}
                  {msg && <p className="text-muted mx-4 mb-0">{msg}</p>}
                </div>
              </div>
            )}
            <div className="d-flex gap-2 justify-content-center mt-3 mb-2">
              <button type="button" className="btn w-sm btn-light" data-bs-dismiss="modal" onClick={onCancel}>
                {cancelBtnLabel || t('MODAL_CANCEL_BTN_LABEL')}
              </button>
              <button type="button" className="btn w-sm btn-success" data-bs-dismiss="modal" onClick={onSubmit}>
                {submitBtnLabel || t('MODAL_SUBMIT_BTN_LABEL')}
              </button>
            </div>
          </React.Fragment>
        )}
        {isLoading && (
          <div className="d-flex gap-2 justify-content-center">
            <Spinner color="secondary" type="grow" />
            <Spinner color="success" type="grow" />
            <Spinner color="warning" type="grow" />
            <Spinner color="danger" type="grow" />
            <Spinner color="dark" type="grow" />
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};
export default ConfirmationModal;
