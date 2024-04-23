import { useTranslate } from '@app/hooks';
import { IFileOverviewProps } from './FileOverview.types';
import { CopyToClipboard, DisplayDateText } from '@components/common';
import { Utils } from '@helpers/utils';
import Image from 'next/image';
const FileOverview = (props: IFileOverviewProps) => {
  const { id, fileName, path, icon, size, sizeType, fileType, createDate, copyURL, onClose, onDownload, onDelete } =
    props;

  const t = useTranslate('COMP_FileOverview');
  return (
    <div className="file-detail-show h-100">
      <div className="d-flex h-100 flex-column">
        <div className="d-flex align-items-center pb-3 border-bottom border-bottom-dashed mb-3 gap-2">
          <h5 className="flex-grow-1 fw-semibold mb-0">{t('PREVIEW')}</h5>
          <div>
            <button
              type="button"
              className="btn btn-soft-danger btn-icon btn-sm fs-16 close-btn-overview"
              onClick={e => {
                if (onClose) onClose(e);
              }}
            >
              <i className="ri-close-fill align-bottom"></i>
            </button>
          </div>
        </div>

        <div className="pb-3 border-bottom border-bottom-dashed mb-3">
          {icon && (
            <div className="file-details-box bg-light p-3 text-center rounded-3 border border-light mb-3">
              {Utils.getFileIcon(icon).type === 'IMG' ? (
                <Image
                  src={icon}
                  className="avatar-xl"
                  alt={fileName}
                  width={0}
                  height={0}
                  loading="lazy"
                  sizes="100vw"
                  style={{ height: 'auto' }}
                />
              ) : (
                <div className="display-4 file-icon">
                  <i className={icon}></i>
                </div>
              )}
            </div>
          )}
          {copyURL && (
            <CopyToClipboard
              text={copyURL}
              successMsg={t('COPY_SUCCESS_MSG', { fileName })}
              errorMsg={t('ERR_COPY_MSG', { fileName })}
            />
          )}
          <h5 className="fs-16 mb-1 file-name">{fileName}</h5>
          <p className="text-muted mb-0 fs-12">
            <span className="file-size">{`${size} ${sizeType}`}</span>,
            <span className="create-date">
              <DisplayDateText date={createDate.toString()} />
            </span>
          </p>
        </div>
        <div>
          <h5 className="fs-12 text-uppercase text-muted mb-3">{t('DESCRIPTION')}</h5>

          <div className="table-responsive">
            <table className="table table-borderless table-nowrap table-sm">
              <tbody>
                <tr>
                  <th scope="row" style={{ width: '35%' }}>
                    {t('FILE_NAME')}
                  </th>
                  <td className="file-name">{fileName}</td>
                </tr>
                <tr>
                  <th scope="row">{t('FILE_TYPE')}</th>
                  <td className="file-type">{fileType}</td>
                </tr>
                <tr>
                  <th scope="row">{t('SIZE')}</th>
                  <td className="file-size">{`${size} ${sizeType}`}</td>
                </tr>
                <tr>
                  <th scope="row">{t('CREATED_AT')}</th>
                  <td className="create-date">
                    <DisplayDateText date={createDate.toString()} />
                  </td>
                </tr>
                <tr>
                  <th scope="row">{t('PATH')}</th>
                  <td className="file-path">
                    <div className="">{path}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-auto border-top border-top-dashed py-3">
          <div className="hstack gap-2">
            {onDownload && (
              <button type="button" className="btn btn-soft-primary w-100" onClick={() => onDownload(id)}>
                <i className="ri-download-2-line align-bottom me-1"></i> {t('DOWNLOAD')}
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="btn btn-soft-danger w-100 remove-file-overview"
                onClick={() => onDelete(id)}
              >
                <i className="ri-close-fill align-bottom me-1"></i> {t('DELETE')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FileOverview;
