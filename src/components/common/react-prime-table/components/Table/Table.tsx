'use client';

import { useEffect, useState } from 'react';
import _ from 'lodash';
import { DataTable } from 'primereact/datatable';
import { MultiSelect } from 'primereact/multiselect';
import { EmptyTable, ExportFile } from '@components/common';
import { DataTableColumnsArray, IExportFile, TableProps } from './Table.types';
import 'primereact/resources/primereact.min.css'; //core css
import './primreact-table.scss';
import { Col, Row } from 'reactstrap';
import { useTranslate } from '@app/hooks';
import { AdvancedSearchHeader, AdvancedSearch } from '../Advanced-Search';
import { Column } from 'primereact/column';

export const Table = (props: TableProps) => {
  const { dataSource, sortedColumn, header, advancedSearch, exportFile, selectionMode, ...rest } = props;
  const hasData = dataSource && dataSource.data && dataSource.data.length > 0;
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState<DataTableColumnsArray>(
    dataSource.columns.filter(col => col.header != ''),
  );
  const [exportFileSettings, setExportFileSettings] = useState<IExportFile>();
  const t = useTranslate('COMP_DATA_TABLE');

  const onColumnToggle = event => {
    if (event.value.length > 0) {
      let selectedColumns = event.value;
      let orderedSelectedColumns = dataSource.columns.filter(col =>
        selectedColumns.some(sCol => sCol.field === col.field),
      );
      setSelectedColumns(orderedSelectedColumns);
    } else {
      event.preventDefault();
      return false;
    }
  };

  useEffect(() => {
    if (selectedColumns && exportFile)
      setExportFileSettings({
        ...exportFile,
        selectedColumns: _.flatMap(selectedColumns, item => {
          return { field: item.field!.toString(), header: item.header!.toString() };
        }),
      });
  }, [exportFile, selectedColumns]);

  const renderHeader = () => {
    return (
      <Row className="justify-content-between">
        {advancedSearch && <AdvancedSearchHeader />}
        {dataSource.data && dataSource.data.length > 0 && (
          <Col sm={3}>
            <div className="text-start">
              <MultiSelect
                value={selectedColumns}
                options={dataSource.columns.filter(col => col.header != '')}
                optionLabel="header"
                onChange={onColumnToggle}
                style={{ width: '15em' }}
              />
            </div>
          </Col>
        )}

        {exportFileSettings && (
          <Col sm={8} className="text-end justify-self-end">
            <ExportFile {...exportFileSettings} />
          </Col>
        )}
      </Row>
    );
  };

  return (
    <Row className="as-container collapsed">
      <AdvancedSearch>{advancedSearch}</AdvancedSearch>
      <Col className="as-table-container">
        <DataTable
          value={dataSource.data}
          size="normal"
          sortMode="single"
          className="as-table align-middle table-nowrap mb-0"
          showGridlines
          emptyMessage={<EmptyTable />}
          totalRecords={dataSource.totalRecords}
          sortField={(hasData ? sortedColumn?.sortField : undefined) || undefined}
          sortOrder={(hasData ? sortedColumn?.sortOrder : undefined) || undefined}
          lazy
          paginator={hasData}
          rows={dataSource.pageSize || 10}
          first={dataSource.skipFirst || 0}
          selection={selectedProducts}
          selectionMode={selectionMode ? selectionMode : 'checkbox'}
          onSelectionChange={e => setSelectedProducts(e.value)}
          header={header === 'none' ? undefined : header || renderHeader}
          columnResizeMode="fit"
          {...rest}
        >
          {dataSource.data &&
            dataSource.data.length > 0 &&
            selectionMode != 'single' &&
            selectionMode != 'multiple' && <Column selectionMode="multiple" style={{ width: '10px' }} />}
          {dataSource.columns
            .filter(col => selectedColumns.some(sCol => sCol.field === col.field || col.header === ''))
            .map((col, i) => {
              return (
                <Column
                  key={`${col.field}-${Math.random()}`}
                  field={col.field}
                  sortable={col.sortable}
                  header={col.header}
                  body={col.body}
                  headerStyle={col.headerStyle || undefined}
                  bodyStyle={col.bodyStyle || undefined}
                  style={col.style || undefined}
                />
              );
            })}
        </DataTable>
      </Col>
    </Row>
  );
};
