import { Row, Col, Card, CardBody, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { useTranslate } from '@app/hooks';
import { IRecentItemsProps } from './RecentItems.types';

const RecentItems = ({ value, name, ...rest }: IRecentItemsProps) => {
  const t = useTranslate('COMP_RecentItems');
  return (
    <div id="folder-list" className="mb-2">
      <Row className="justify-content-beetwen g-2 mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <h5 className="fs-16 mb-0">{name}</h5>
            </div>
          </div>
        </Col>
      </Row>

      <Row id="folderlist-data">
        {(value || []).map((item, key) => (
          <Col xxl={3} className="col-6 folder-card" key={'folder-' + key}>
            <Card className="bg-light shadow-none">
              <CardBody>
                {item.actions && (
                  <div className="d-flex mb-1 justify-content-end">
                    <UncontrolledDropdown className="text-end">
                      <DropdownToggle tag="button" className="btn btn-ghost-primary btn-icon btn-sm dropdown">
                        <i className="ri-more-2-fill fs-16 align-bottom" />
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end">
                        {(item.actions || []).map((action, indx) => (
                          <DropdownItem
                            key={'act-' + indx}
                            className="edit-folder-list"
                            onClick={() => {
                              if (action.onClick) action.onClick(item.dataKey);
                            }}
                          >
                            {action.iconClass && <i className={action.iconClass}></i>}
                            {action.label}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                )}

                <div className="text-center">
                  <div className="mb-2">
                    <i className={`${item.iconClass || 'ri-folder-2-fill text-warning'} align-bottom display-5`}></i>
                  </div>
                  <h6 className="fs-15 folder-name">{item.name}</h6>
                </div>
                <div className="hstack mt-4 text-muted">
                  {item.numberOfFiles && (
                    <span className="me-auto">
                      <b>{item.numberOfFiles}</b> {t('FILES')}
                    </span>
                  )}
                  {item.size && (
                    <span>
                      <b>{item.size.value}</b>
                      {item.size.sizeType}
                    </span>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
export default RecentItems;
