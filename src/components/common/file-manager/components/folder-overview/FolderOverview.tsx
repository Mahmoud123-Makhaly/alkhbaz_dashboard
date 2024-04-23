import { useTranslate } from '@app/hooks';
import OverviewDonutCharts from './FolderOverviewCharts';
import './FileManagerOverview.css';
import { IFolderOverviewProps } from './FolderOverviewCharts.types';

const FolderOverviewChart = ({ data, onClose }: IFolderOverviewProps) => {
  const t = useTranslate('COMP_FolderOverview');

  return (
    <div id="folder-overview">
      <div className="d-flex align-items-center pb-3 border-bottom border-bottom-dashed">
        <h5 className="flex-grow-1 fw-semibold mb-0">{t('Overview')}</h5>
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
      {data && (
        <OverviewDonutCharts
          data={data.map(item => {
            return { label: item.label, color: item.color, size: item.size };
          })}
        />
      )}
      <div className="mt-4">
        <ul className="list-unstyled vstack gap-4">
          {data?.map((item, indx) => (
            <li key={`overview-tag-${indx}`}>
              <div className="d-flex align-items-center">
                {item.iconClassName && (
                  <div className="flex-shrink-0">
                    <div className="avatar-xs">
                      <div className={`avatar-title rounded bg-soft${item.color} text${item.color}`}>
                        <i className={item.iconClassName + ' fs-17'}></i>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex-grow-1 ms-3">
                  <h5 className="mb-1 fs-15">{item.label}</h5>
                  <p className="mb-0 fs-12 text-muted">{item.infoTag}</p>
                </div>
                <b>{`${item.size} ${item.sizeType}`}</b>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default FolderOverviewChart;
