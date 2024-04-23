'use client';

import Link from 'next-intl/link';
import { useRef } from 'react';
import { Button, Col, Input, Row } from 'reactstrap';
import { useTranslate } from '@app/hooks';

type KeywordSearchProps = {
  defaultValue?: string;
  search: (keyword: string) => void;
  reset: () => void;
};
const KeywordSearch = ({ defaultValue, search, reset }: KeywordSearchProps) => {
  const t = useTranslate('Components.KeywordSearch');
  const searchInput = useRef<HTMLInputElement>(null);
  const onSubmit = () => {
    search(searchInput.current?.value.trim() || '');
  };
  const onEnter = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };
  const onChange = () => {
    if (!searchInput.current?.value) {
      onReset();
    }
  };
  const onReset = () => {
    searchInput.current!.value = '';
    reset();
  };
  return (
    <Row className="g-2">
      <Col>
        <div className="position-relative mb-3">
          <input
            type="text"
            className="form-control form-control-md bg-light border-light"
            placeholder={t('SEARCH_HERE')}
            ref={searchInput}
            onKeyDown={onEnter}
            onChange={onChange}
            defaultValue={defaultValue || ''}
          />
          {searchInput.current?.value && (
            <Link href="#" className="btn btn-link link-primary btn-md position-absolute end-0 top-0" onClick={onReset}>
              <i className="ri-close-fill"></i>
            </Link>
          )}
        </div>
      </Col>
      <div className="col-auto">
        <Button color="primary" className="btn-icon rounded-pill" type="button" onClick={onSubmit}>
          <i className="ri-search-line"></i>
        </Button>
      </div>
    </Row>
  );
};
export default KeywordSearch;
