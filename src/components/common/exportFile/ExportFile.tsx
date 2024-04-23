'use client';
import './Amiri-Regular-normal';
import { useCallback, useMemo, useState } from 'react';
import { ButtonGroup, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import _ from 'lodash';
import { useLocale } from 'next-intl';
import * as xlsx from 'xlsx';
import jsPDF from 'jspdf';
import autoTable, { Styles } from 'jspdf-autotable';
import { useTranslate, useAPIAuthClient, useToast } from '@app/hooks';
import { ExportType, IExportFileProps } from './ExportFile.types';
import ExportModal from './ExportModal';
import React from 'react';
import { Utils } from '@helpers/utils';

const ExportFile = (props: IExportFileProps) => {
  const modalReset: any = useMemo(
    () => ({
      header: '',
      msg: '',
      iconClass: 'ri-file-list-fill text-primary',
      show: false,
      isLoading: true,
      ext: '',
    }),
    [],
  );
  const { fileName, endpoint, listResultPropName, method, payload, selectedColumns, exportTypes, dataResolver } = props;
  const [exportModal, setExportModal] = useState(modalReset);
  const t = useTranslate('COMP_ExportFile');
  const apiClient = useAPIAuthClient();
  const toast = useToast();
  const locale = useLocale();

  const exportActions = useMemo(
    () => [
      {
        name: 'CSV',
        type: ExportType.csv,
        className: 'ri-file-text-fill text-muted',
      },
      {
        name: 'Excel',
        type: ExportType.xlsx,
        className: 'ri-file-excel-fill text-success',
      },
      {
        name: 'PDF',
        type: ExportType.pdf,
        className: 'ri-file-pdf-fill text-danger',
      },
    ],
    [],
  );

  const search = useCallback(
    () =>
      apiClient
        .search<any>(endpoint, payload)
        .then(
          data => {
            const response = listResultPropName ? data[listResultPropName] : data;
            return Promise.resolve(response);
          },
          err => Promise.reject(err),
        )
        .catch(reason => Promise.reject(reason)),
    [apiClient, endpoint, listResultPropName, payload],
  );

  const select = useCallback(
    () =>
      apiClient
        .select<any>(endpoint, payload)
        .then(
          data => {
            const response = listResultPropName ? data[listResultPropName] : data;
            return Promise.resolve(response);
          },
          err => Promise.reject(err),
        )
        .catch(reason => Promise.reject(reason)),
    [apiClient, endpoint, listResultPropName, payload],
  );

  const saveFile = useCallback(() => {
    if (exportModal.ext != 'pdf') {
      const blob = new Blob([exportModal.file]);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = `${fileName}.${exportModal.ext}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (exportModal.ext === 'pdf') {
      exportModal.file.save(`${fileName}.pdf`);
    }
    setExportModal(modalReset);
  }, [exportModal.ext, exportModal.file, fileName, modalReset]);

  const exportExcel = useCallback(
    data => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook: xlsx.WorkBook = {
        Sheets: { [fileName]: worksheet },
        SheetNames: [fileName],
      };
      if (locale === 'ar') workbook.Workbook = { Views: [{ RTL: true }] };
      const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      setExportModal(prev => ({
        ...prev,
        show: true,
        isLoading: false,
        file: excelBuffer,
        ext: 'xlsx',
        header: t('MODAL_HEADER', { type: fileName }),
        msg: t('MODAL_MSG', { fileName: `${fileName}.xlsx` }),
        iconClass: Utils.getFileIcon(`${fileName}.xlsx`).icon,
      }));
    },
    [fileName, locale, t],
  );

  const exportPdf = useCallback(
    data => {
      const doc = new jsPDF();
      const keys = Object.keys(data[0]);
      const dataValues = data.map(e => Object.values(e));
      autoTable(doc, {
        head: [keys],
        body: dataValues,
        pageBreak: 'auto',
        tableWidth: 'auto',
        headStyles: { overflow: 'visible', font: 'Amiri-Regular', halign: locale === 'ar' ? 'right' : 'left' },
        bodyStyles: { overflow: 'visible', font: 'Amiri-Regular', halign: locale === 'ar' ? 'right' : 'left' },
        columnStyles: _.zipObject(
          keys,
          keys.map(key => ({ overflow: 'linebreak', cellWidth: 'wrap' })),
        ) as { [key: string]: Partial<Styles> },
      });
      setExportModal(prev => ({
        ...prev,
        show: true,
        isLoading: false,
        file: doc,
        ext: 'pdf',
        header: t('MODAL_HEADER', { type: fileName }),
        msg: t('MODAL_MSG', { fileName: `${fileName}.pdf` }),
        iconClass: Utils.getFileIcon(`${fileName}.pdf`).icon,
      }));
    },
    [fileName, locale, t],
  );

  const exportCSV = useCallback(
    data => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const csv = xlsx.utils.sheet_to_csv(worksheet);
      setExportModal(prev => ({
        ...prev,
        show: true,
        isLoading: false,
        file: csv,
        ext: 'csv',
        header: t('MODAL_HEADER', { type: fileName }),
        msg: t('MODAL_MSG', { fileName: `${fileName}.csv` }),
        iconClass: Utils.getFileIcon(`${fileName}.csv`).icon,
      }));
    },
    [fileName, t],
  );

  const dataMapper = useCallback(
    data => {
      // Create a map of field-to-header mappings
      const fieldToHeaderMap = _.keyBy(selectedColumns, 'field');

      // Use _.map to iterate through the data array and rename keys
      const renamedData = _.map(data, item => {
        const renamedItem: { [key: string]: any } = {};

        // Iterate through the keys in the item
        _.forEach(item, (value, key) => {
          // Use the field-to-header mapping to find the new key
          const newKey = fieldToHeaderMap[key]['header'] || key;

          // Assign the value to the new key in the renamedItem object
          renamedItem[newKey] = value;
        });

        return renamedItem;
      });
      return renamedData;
    },
    [selectedColumns],
  );

  const onExport = useCallback(
    (type: ExportType) => {
      setExportModal(prev => ({ ...prev, show: true, isLoading: true }));
      (method === 'search' ? search() : select())
        .then(
          data => {
            if (data && data.length > 0) {
              let revisedData = data;
              if (dataResolver) revisedData = dataResolver(revisedData, type);
              if (selectedColumns) {
                revisedData = revisedData.map(item =>
                  _.pick(
                    item,
                    Array.isArray(selectedColumns)
                      ? _.flatMap(selectedColumns, col => col.field)
                      : selectedColumns.field,
                  ),
                );
                revisedData = dataMapper(revisedData);
              }
              switch (type) {
                case ExportType.xlsx:
                  exportExcel(revisedData);
                  break;
                case ExportType.pdf:
                  exportPdf(revisedData);
                  break;
                case ExportType.csv:
                  exportCSV(revisedData);
                  break;
                default:
                  exportExcel(revisedData);
                  break;
              }
            } else {
              toast.warn(t('WAR_NO_DATA_FOUND'));
              setExportModal(modalReset);
            }
          },
          err => {
            toast.error(
              t('ERR_GENERIC_MSG', { trace: process.env.NODE_ENV === 'development' ? JSON.stringify(err) : '' }),
            );
            setExportModal(modalReset);
          },
        )
        .catch(reason => {
          toast.error(
            t('ERR_GENERIC_MSG', { trace: process.env.NODE_ENV === 'development' ? JSON.stringify(reason) : '' }),
          );
          setExportModal(modalReset);
        });
    },
    [
      dataMapper,
      dataResolver,
      exportCSV,
      exportExcel,
      exportPdf,
      method,
      modalReset,
      search,
      select,
      selectedColumns,
      t,
      toast,
    ],
  );

  const loadActions = useCallback(() => {
    let revisedExportActions = exportActions;
    if (exportTypes) revisedExportActions = revisedExportActions.filter(x => exportTypes.includes(x.type));
    return revisedExportActions;
  }, [exportActions, exportTypes]);

  return (
    <React.Fragment>
      <ButtonGroup>
        <UncontrolledDropdown>
          <DropdownToggle tag="button" className="btn btn-primary rounded">
            {t('EXPORT')} <i className="mdi mdi-chevron-down"></i>
          </DropdownToggle>
          <DropdownMenu>
            {loadActions().map((elem, indx) => (
              <DropdownItem key={'export-action-' + indx} onClick={() => onExport(elem.type)} className="d-flex">
                <i className={`${elem.className} align-bottom me-1`}></i>
                {elem.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </ButtonGroup>
      <ExportModal
        header={exportModal.header}
        msg={exportModal.msg}
        show={exportModal.show}
        isLoading={exportModal.isLoading}
        iconClass={exportModal.iconClass}
        onCancel={() => setExportModal(modalReset)}
        onDownload={saveFile}
      />
    </React.Fragment>
  );
};
export default ExportFile;
