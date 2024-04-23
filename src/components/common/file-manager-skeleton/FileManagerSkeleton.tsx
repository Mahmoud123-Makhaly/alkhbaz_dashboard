'use client';

import { Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from 'reactstrap';
import TableSkeleton from '../TableSkeleton';
import SimpleBar from 'simplebar-react';
import './FileManagerSkeleton.css';
const FileManagerSkeleton = () => (
  <div className="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1 card-text placeholder-glow">
    <div className="file-manager-sidebar">
      <div className="p-3 d-flex flex-column h-100 mt-3">
        {[...Array(12)].map((e, i) => (
          <span key={`skel-${i}`} className="placeholder col-12 placeholder-table"></span>
        ))}
      </div>
    </div>
    <div className="file-manager-content w-100 p-3 py-0">
      <div className="mx-n3 pt-4 px-24 file-manager-content-scroll">
        <div id="folder-list" className="mb-2">
          <Row id="folderlist-data">
            <Col md={3} className="col-6 folder-card">
              <span className="placeholder col-12 mt-2 placeholder-file-manager-card"></span>
            </Col>
            <Col md={3} className="col-6 folder-card">
              <span className="placeholder col-12 mt-2 placeholder-file-manager-card"></span>
            </Col>
            <Col md={3} className="col-6 folder-card">
              <span className="placeholder col-12 mt-2 placeholder-file-manager-card"></span>
            </Col>
            <Col md={3} className="col-6 folder-card">
              <span className="placeholder col-12 mt-2 placeholder-file-manager-card"></span>
            </Col>
          </Row>
        </div>
        <div>
          <div className="align-items-center mt-2 row g-3 text-center text-sm-start">
            {[...Array(5)].map((e, i) => (
              <span key={`skel-${i}`} className="placeholder col-12 placeholder-table"></span>
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="file-manager-sidebar">
      <div className="p-3 d-flex flex-column h-100">
        <SimpleBar className="mx-n3 pt-3 px-16 file-detail-content-scroll">
          <div className="d-flex h-100 flex-column">
            <div className="pb-3 border-bottom border-bottom-dashed mb-3">
              <div className="file-details-box bg-light p-3 text-center rounded-3 border border-light mb-3">
                <div className="display-4 file-icon">
                  <span className="placeholder col-12 placeholder-file-manager-card"></span>
                </div>
              </div>
              <span className="placeholder col-6 mb-4 placeholder-file-manager-record"></span>
              <p className="text-muted mb-0 fs-12">
                <span className="placeholder col-4 mb-4 placeholder-file-manager-record"></span>
              </p>
            </div>
            <div>
              <div className="table-responsive">
                {[...Array(8)].map((e, i) => (
                  <span key={`skel-${i}`} className="placeholder col-12 mb-4 placeholder-file-manager-record"></span>
                ))}
              </div>
            </div>

            <div className="mt-auto border-top border-top-dashed py-3">
              <div className="hstack gap-2">
                <span className="placeholder col-5 mb-4 placeholder-file-manager-btn"></span>
              </div>
            </div>
          </div>
        </SimpleBar>
      </div>
    </div>
  </div>
);

export default FileManagerSkeleton;
