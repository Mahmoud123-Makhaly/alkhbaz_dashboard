'use client';

import { MouseEventHandler } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import Image from 'next/image';
import { useTranslate } from '@app/hooks';
import DeleteSVG from '@assets/img/svg/delete.svg';

export interface IDeleteModalProps {
  show: boolean;
  onDeleteClick: MouseEventHandler;
  onCloseClick: MouseEventHandler;
  question?: string;
  confirmationMessage?: string;
}
const DeleteModal = ({ show, onDeleteClick, onCloseClick, question, confirmationMessage }: IDeleteModalProps) => {
  const t = useTranslate('COMP_DeleteModal');
  return (
    <Modal fade={true} isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalBody className="py-3 px-5">
        <div className="mt-2 text-center">
          <Image
            src={DeleteSVG.src}
            // trigger="loop"
            // colors="primary:#f7b84b,secondary:#f06548"
            alt="delete"
            width={100}
            height={100}
          />
          <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <h4>{question ? question : t('QUESTION')}</h4>
            <p className="text-muted mx-4 mb-0">
              {confirmationMessage ? confirmationMessage : t('CONFIRMATION_MESSAGE')}
            </p>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <button type="button" className="btn w-sm btn-light" data-bs-dismiss="modal" onClick={onCloseClick}>
            {t('CLOSE')}
          </button>
          <button type="button" className="btn w-sm btn-danger " id="delete-record" onClick={onDeleteClick}>
            {t('YES')}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DeleteModal;
