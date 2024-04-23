'use client';

import React, { MouseEventHandler, useRef, useState } from 'react';
import Link from 'next-intl/link';
import SimpleBar from 'simplebar-react';
import './FileManagerFolderTree.css';

import { IFMFTreeProps } from './FileManagerFolderTree.types';
import { useTranslate } from '@app/hooks';
import { KeywordSearch } from '@components/common';

const FolderTree = (props: IFMFTreeProps) => {
  const { search, storageStatus, tree } = props;
  const t = useTranslate('COMP_FileManagerFolderTree');
  const [activeRoot, setActiveRoot] = useState('');
  const [activeLeaf, setActiveLeaf] = useState('');
  const searchInput = useRef<HTMLInputElement>(null);

  const activateLink = (e, itemKey, dataKey, onClick?: MouseEventHandler, type = 'root') => {
    if (type == 'root') {
      setActiveRoot(prev => (prev === itemKey ? '' : itemKey));
      setActiveLeaf('');
    }
    if (type == 'leaf') setActiveLeaf(itemKey);
    document.getElementById('folder-list')!.style.display = 'none';
    if (onClick) onClick(dataKey);
  };
  const onEnter = keyword => {
    if (search) search(keyword);
  };

  return (
    <div className="file-manager-sidebar">
      <div className="p-3 d-flex flex-column h-100">
        <div className="mb-3">
          <h5 className="mb-0 fw-semibold">{t('MY_DRIVE')}</h5>
        </div>
        {/* Search */}
        {search && (
          <div className="search-box">
            <KeywordSearch search={keyword => onEnter(keyword)} reset={() => onEnter('')} />
          </div>
        )}

        {/* Tree */}
        <SimpleBar className="mt-3 mx-n4 px-24 file-menu-sidebar-scroll">
          <ul className="list-unstyled file-manager-menu">
            {tree.map((root, indx) => (
              <li key={root.key}>
                {!root.leafs && (
                  <Link
                    key={'root-' + root.key}
                    id={'root-' + root.key}
                    href="#"
                    className={`d-flex${activeRoot === 'root-' + root.key ? ' active' : ''}`}
                    onClick={e => activateLink(e, 'root-' + root.key, root.key, root.onClick)}
                  >
                    <i className={(root.iconClassName || 'ri-folder-2-line') + ' align-bottom me-2'}></i>
                    <span className="file-list-link">{root.name}</span>
                  </Link>
                )}
                {root.leafs && (
                  <React.Fragment>
                    <a
                      key={'root-' + root.key}
                      id={'root-' + root.key}
                      className={`d-flex${activeRoot === 'root-' + root.key ? ' active' : ''}`}
                      onClick={e => activateLink(e, 'root-' + root.key, root.key)}
                      data-bs-toggle="collapse"
                      href={'#leafs-' + root.key}
                      role="button"
                      aria-expanded={activeRoot === 'root-' + root.key ? true : false}
                      aria-controls={'leafs-' + root.key}
                    >
                      <i className={(root.iconClassName || 'ri-folder-2-line') + ' align-bottom me-2'}></i>
                      <span className="file-list-link">{root.name}</span>
                    </a>
                    <div className={activeRoot === 'root-' + root.key ? 'show' : 'collapse'} id={'leafs-' + root.key}>
                      <ul className="sub-menu list-unstyled">
                        {root.leafs.map((leaf, indx) => (
                          <li key={'leaf-' + leaf.key}>
                            <Link
                              href="#"
                              onClick={e => activateLink(e, 'leaf-' + leaf.key, leaf.key, leaf.onClick, 'leaf')}
                              className={'leaf ' + (activeLeaf === 'leaf-' + leaf.key ? 'active' : '')}
                            >
                              {leaf.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </React.Fragment>
                )}
              </li>
            ))}
          </ul>
        </SimpleBar>

        {/* Sorage Status */}
        {storageStatus && (
          <div className="mt-auto">
            <h6 className="fs-11 text-muted text-uppercase mb-3">{t('STORAGE_STATUS')}</h6>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <i className="ri-database-2-line fs-17"></i>
              </div>
              <div className="flex-grow-1 ms-3 overflow-hidden">
                <div className="progress mb-2 progress-sm">
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: '25%' }}
                    aria-valuenow={25}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
                <span className="text-muted fs-12 d-block text-truncate">
                  <b>47.52</b>GB {t('USED_OF')} <b>119</b>GB
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default FolderTree;
