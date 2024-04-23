import { useEffect } from 'react';
import { Col, Button } from 'reactstrap';
import './AdvancedSearch.scss';

const AdvancedSearchHeader = () => {
  const onFilterToggle = ele => {
    document.getElementsByClassName('as-container')[0].classList.toggle('collapsed');
    if (ele.closest('button').classList.contains('active')) {
      ele.closest('button').classList.remove('active');
    } else {
      ele.closest('button').classList.add('active');
    }
  };

  useEffect(() => {
    const hTbl = document.querySelector<HTMLElement>('.as-table');
    const hFrm = document.querySelector<HTMLElement>('.as-form-container');
    if (hTbl && hFrm) {
      hFrm.style.maxHeight = hTbl.offsetHeight - 72 + 'px';
    }
  }, []);

  return (
    <Col sm={1}>
      <Button color="primary" className="custom-toggle" onClick={e => onFilterToggle(e.target)} outline>
        <span className="icon-on">
          <i className="ri-filter-2-line align-bottom"></i>
        </span>
        <span className="icon-off">
          <i className="ri-filter-2-fill align-bottom"></i>
        </span>
      </Button>
    </Col>
  );
};
export default AdvancedSearchHeader;
