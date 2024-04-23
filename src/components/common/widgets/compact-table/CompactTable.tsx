import React from 'react';
import { Col, Table } from 'reactstrap';
import { useTranslate } from '@app/hooks';
import { EmptyTable } from '@components/common';
export interface IColumnsProps {
  headers: Array<{ title: string; field: string }>;
  data?: Array<any>;
  hideHeader?: boolean;
}
const CompactTable = ({ headers, data, hideHeader }: IColumnsProps) => {
  const t = useTranslate('COMP_CompactTable');
  return (
    <React.Fragment>
      {data ? (
        <div className="table-responsive table-card">
          <Table className="table table-centered table-hover align-middle table-nowrap mb-0">
            {!hideHeader && (
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index}>{header.title}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {data.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((row, colIndex) => (
                    <td key={colIndex}>{item[row.field] ?? t('N/A')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Col>
          <EmptyTable message={t('NO_ITEMS')} />
        </Col>
      )}
    </React.Fragment>
  );
};

export default CompactTable;
