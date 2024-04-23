'use client';

import { useEffect } from 'react';
import SimpleBar from 'simplebar-react';
import './FileManager.css';

import { FolderTree } from './folder-tree';
import { FolderOverviewChart } from './folder-overview';
import { FileOverview } from './file-overview';
import { RecentItems } from './recent-items';
import { IFileManagerProps } from './FileManager.types';
import { DataLoader, DataLoadingStatus, Table } from '@components/common';
import { Button, ButtonGroup, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { useTranslate } from '@app/hooks';
const FileManager = (props: IFileManagerProps) => {
  const {
    defaultTree,
    recentItems,
    fileOverview,
    folderOverview,
    dataList,
    dataListStatus,
    dataListHeader,
    folderLevelUp,
    currentFolder,
    onNewFile,
    onNewFolder,
  } = props;
  const t = useTranslate('COMP_FILE_MANAGER');

  // SideBar Open
  const onFolderOverviewClose = e => {
    sidebarClose('file-detail-show');
  };
  const onFileOverviewClose = e => {
    sidebarClose('file-detail-show');
  };
  function sidebarOpen(value) {
    const element = document.getElementsByTagName('body')[0];
    element.classList.add(value);
  }

  // SideBar Close
  function sidebarClose(value) {
    const element = document.getElementsByTagName('body')[0];
    element.classList.remove(value);
  }
  useEffect(() => {
    if (fileOverview || folderOverview) sidebarOpen('file-detail-show');
  }, [fileOverview, folderOverview]);

  return (
    <div className="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">
      <div className="flex-shrink-0 d-block px-10 pt-2 bg-white d-lg-none">
        <button
          type="button"
          className="btn btn-soft-success btn-icon btn-sm fs-16 file-menu-btn"
          onClick={() => {
            const folderTreeBurgerMenu = document.querySelector('.file-manager-sidebar');
            document.getElementsByClassName('file-manager-content')[0].addEventListener('click', function (e) {
              folderTreeBurgerMenu?.classList.remove('menubar-show');
            });
            if (!folderTreeBurgerMenu?.classList.contains('menubar-show'))
              folderTreeBurgerMenu?.classList.toggle('menubar-show');
          }}
        >
          <i className="ri-menu-2-fill align-bottom"></i>
        </button>
      </div>
      {defaultTree && <FolderTree {...defaultTree} />}
      <div className="file-manager-content overflow-auto w-100 p-3 py-0">
        <div className="mx-n3 pt-4 px-24 file-manager-content-scroll">
          {recentItems && <RecentItems {...recentItems} />}
          <div>
            <DataLoader status={dataListStatus} count={5}>
              <div className="d-flex align-items-center mb-3">
                <h5 className="flex-grow-1 fs-16 mb-0" id="filetype-title">
                  {dataListHeader}
                  {folderLevelUp && (
                    <Button
                      color="success"
                      className="btn-icon mx-2"
                      outline
                      onClick={e => folderLevelUp.onClick(folderLevelUp.dataUpKey)}
                    >
                      <i className="mdi mdi-keyboard-return fs-3" />
                    </Button>
                  )}
                </h5>
                <div className="flex-shrink-0">
                  <ButtonGroup>
                    <UncontrolledDropdown>
                      <DropdownToggle tag="button" className="btn btn-success">
                        <i className="ri-add-line align-bottom me-1"></i>
                        {t('NEW')}
                      </DropdownToggle>
                      <DropdownMenu>
                        {onNewFile && (
                          <DropdownItem onClick={onNewFile}>
                            <i className="ri-file-fill text-primary align-bottom me-1"></i>&nbsp;{t('FILE')}
                          </DropdownItem>
                        )}
                        {onNewFolder && (
                          <DropdownItem onClick={onNewFolder}>
                            <i className="ri-folder-2-fill text-warning align-bottom me-1"></i>&nbsp;{t('FOLDER')}
                          </DropdownItem>
                        )}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </ButtonGroup>
                </div>
              </div>
              <div className="table-responsive">
                <Table
                  className="file-manager-table"
                  {...dataList}
                  dataSource={dataList.dataSource}
                  sortedColumn={dataList.sortedColumn}
                  onSort={dataList.onSort}
                  onPage={dataList.onPage}
                />
              </div>
            </DataLoader>
          </div>
        </div>
      </div>
      {(folderOverview || fileOverview) && dataListStatus === DataLoadingStatus.done && (
        <div className="file-manager-detail-content p-3 py-0">
          <SimpleBar className="mx-n3 pt-3 px-16 file-detail-content-scroll">
            {folderOverview && (
              <FolderOverviewChart data={folderOverview?.data} onClose={e => onFolderOverviewClose(e)} />
            )}
            {fileOverview && <FileOverview {...fileOverview} onClose={e => onFileOverviewClose(e)} />}
          </SimpleBar>
        </div>
      )}
    </div>
  );
};
export default FileManager;
