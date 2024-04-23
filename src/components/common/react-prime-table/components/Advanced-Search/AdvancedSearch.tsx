import { Col } from 'reactstrap';
import { useTranslate } from '@app/hooks';

const AdvancedSearch = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslate('COMP_DATA_TABLE');
  return (
    <Col lg={3} className="as-form-col m-0 p-0 ">
      <div className="align-items-center bg-light d-flex justify-content-between px-12 py-28">
        <h5 className="fw-semibold mb-0">{t('ADVANCED_SEARCH')}</h5>
        <button
          className="btn btn-close btn-sm"
          onClick={() => document.getElementsByClassName('as-container')[0].classList.toggle('collapsed')}
        ></button>
      </div>
      <div className="overflow-auto as-form-container">{children}</div>
    </Col>
  );
};
export default AdvancedSearch;
