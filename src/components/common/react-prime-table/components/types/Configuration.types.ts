import React from 'react';
import {
  DataTableCellClassNameOptions,
  DataTableCellClickEvent,
  DataTableColReorderEvent,
  DataTableColumnResizeEndEvent,
  DataTableColumnResizerClickEvent,
  DataTableContextMenuSelectionChangeEvent,
  DataTableDataSelectableEvent,
  DataTableEditingRows,
  DataTableExpandedRows,
  DataTableFilterMeta,
  DataTableFooterTemplateType,
  DataTableHeaderTemplateType,
  DataTablePassThroughOptions,
  DataTableRowClassNameOptions,
  DataTableRowClickEvent,
  DataTableRowData,
  DataTableRowDataArray,
  DataTableRowEditCompleteEvent,
  DataTableRowEditEvent,
  DataTableRowEditSaveEvent,
  DataTableRowEditValidatorOptions,
  DataTableRowEvent,
  DataTableRowExpansionTemplate,
  DataTableRowGroupFooterTemplateType,
  DataTableRowGroupHeaderTemplateType,
  DataTableRowMouseEvent,
  DataTableRowReorderEvent,
  DataTableRowToggleEvent,
  DataTableSelectAllChangeEvent,
  DataTableSelectEvent,
  DataTableSelection,
  DataTableSelectionChangeEvent,
  DataTableShowRowReorderElementOptions,
  DataTableShowSelectionElementOptions,
  DataTableSortMeta,
  DataTableStateEvent,
  DataTableUnselectEvent,
  DataTableValueArray,
} from 'primereact';
import { PaginatorTemplate } from 'primereact/paginator';
import { VirtualScrollerProps } from 'primereact/virtualscroller';
import { DataTableValues } from './Data.types';
import { SortedColumn } from './SortedColumn.types';
import { IExportFileProps as IExportFile } from '@components/common';
export type TableConfigurations = {
  advancedSearch?: React.ReactNode | undefined;
  /**
   * Unique identifier of the element.
   */
  id?: string | undefined;
  /**
   * An array of objects to display.
   */
  dataSource: DataTableValues;
  /**
   * Whether to show it even there is only one page.
   * @defaultValue true
   */
  alwaysShowPaginator?: boolean | undefined;
  /**
   * The breakpoint to define the maximum width boundary when using stack responsive layout.
   * @defaultValue 960px
   */
  breakpoint?: string | undefined;
  /**
   * Icon to display in the checkbox.
   */
  checkIcon?: React.ReactNode | undefined;
  /**
   * Whether to cell selection is enabled or not.
   * @defaultValue false
   */
  cellSelection?: false | undefined;
  /**
   * Style class of the component.
   */
  className?: string | undefined;
  /**
   * Icon of the row toggler to display the row as collapsed.
   */
  collapsedRowIcon?: React.ReactNode | undefined;
  /**
   * Used to define the resize mode of the columns, valid values are "fit" and "expand".
   * @defaultValue fit
   */
  columnResizeMode?: 'fit' | 'expand' | undefined;
  /**
   * Algorithm to define if a row is selected, valid values are "equals" that compares by reference and "deepEquals" that compares all fields.
   * @defaultValue deepEquals
   */
  compareSelectionBy?: 'deepEquals' | 'equals' | undefined;
  /**
   * Selected row in single mode or an array of values in multiple mode.
   */
  contextMenuSelection?: object | undefined;
  /**
   * Character to use as the csv separator.
   * @defaultValue ,
   */
  csvSeparator?: string | undefined;
  /**
   * Template of the current page report element. Available placeholders are &#123;currentPage&#125;, &#123;totalPages&#125;, &#123;rows&#125;, &#123;first&#125;, &#123;last&#125; and &#123;totalRecords&#125;
   * @defaultValue (&#123;currentPage&#125; of &#123;totalPages&#125;)
   */
  currentPageReportTemplate?: string | undefined;
  /**
   * Name of the field that uniquely identifies a record in the data. Should be a unique business key to prevent re-rendering.
   * @defaultValue (&#123;currentPage&#125; of &#123;totalPages&#125;)
   */
  dataKey?: string | undefined;
  /**
   * Default sort order of an unsorted column.
   * @defaultValue (&#123;currentPage&#125; of &#123;totalPages&#125;)
   */
  defaultSortOrder?: 1 | 0 | -1 | null | undefined;
  /**
   * When enabled, a rectangle that can be dragged can be used to make a range selection.
   * @defaultValue false
   */
  dragSelection?: boolean | undefined;
  /**
   * Defines editing mode, options are "cell" and "row".
   * @defaultValue cell
   */
  editMode?: string | undefined;
  /**
   * A collection of rows to represent the current editing data in row edit mode.
   */
  editingRows?: DataTableValueArray | DataTableEditingRows | undefined;
  /**
   * Text to display when there is no data.
   */
  emptyMessage?: React.ReactNode | ((frozen: boolean) => React.ReactNode);
  /**
   * Makes row groups toggleable, default is false.
   * @defaultValue false
   */
  expandableRowGroups?: boolean | undefined;
  /**
   * Icon of the row toggler to display the row as expanded.
   */
  expandedRowIcon?: React.ReactNode | undefined;
  /**
   * A collection of rows or a map object row data keys that are expanded.
   */
  expandedRows?: DataTableValueArray | DataTableExpandedRows | undefined;

  /**
   * Represents a property called 'exportFile' of type 'IExportFile' or 'undefined'.
   *
   * @example
   * <ExportFile
            fileName={'sample-data'}
            endpoint={'catalog/catalogs/search'}
            listResultPropName="results"
            method={'search'}
            payload={{ skip: 0, take: 10000, responseGroup: 'none' }}
            exportTypes=[ExportType.pdf,ExportType.csv]
            selectedColumns={['name', 'isVirtual', 'outerId', 'createdDate', 'modifiedDate', 'createdBy', 'modifiedBy']}
          />
   */
  exportFile?: IExportFile | undefined;
  /**
   * Delay in milliseconds before filtering the data.
   * @defaultValue 300
   */
  filterDelay?: number | undefined;
  /**
   * Layout of the filter elements, valid values are "row" and "menu".
   * @defaultValue menu
   */
  filterDisplay?: 'menu' | 'row' | undefined;
  /**
   * Locale to use in filtering. The default locale is the host environment's current locale.
   * @defaultValue undefined
   */
  filterLocale?: string | undefined;
  /**
   * Icon to display the current filtering status.
   */
  filterIcon?: React.ReactNode | undefined;
  /**
   * Icon to display when the filter can be cleared.
   */
  filterClearIcon?: React.ReactNode | undefined;
  /**
   * An array of FilterMetadata objects to provide external filters.
   */
  filters?: DataTableFilterMeta | undefined;
  /**
   * Custom footer content of the table.
   */
  footer?: DataTableFooterTemplateType<DataTableValueArray>;
  /**
   * ColumnGroup component for footer.
   */
  footerColumnGroup?: React.ReactNode | undefined;
  /**
   * Items of the frozen part in scrollable DataTable.
   */
  frozenValue?: DataTableRowDataArray<DataTableValueArray>;
  /**
   * Width of the frozen part in scrollable DataTable.
   */
  frozenWidth?: string | undefined;
  /**
   * Value of the global filter to use in filtering.
   */
  globalFilter?: string | null | undefined;
  /**
   * Define fields to be filtered globally.
   */
  globalFilterFields?: string[] | undefined;
  /**
   * Defines filterMatchMode; "startsWith", "contains", "endsWith", "equals", "notEquals", "in", "lt", "lte", "gt", "gte" and "custom".
   * @defaultValue contains
   */
  globalFilterMatchMode?:
    | 'startsWith'
    | 'contains'
    | 'endsWith'
    | 'equals'
    | 'notEquals'
    | 'in'
    | 'lt'
    | 'lte'
    | 'gt'
    | 'gte'
    | 'custom'
    | undefined;
  /**
   * Used for either be grouped by a separate grouping row or using rowspan.
   */
  groupRowsBy?: string | undefined;
  /**
   * Custom header content of the table.
   */
  header?: DataTableHeaderTemplateType<DataTableValueArray> | undefined;
  /**
   * ColumnGroup component for header.
   */
  headerColumnGroup?: React.ReactNode | undefined;
  /**
   * Displays a loader to indicate data load is in progress.
   * @defaultValue false
   */
  loading?: boolean | undefined;
  /**
   * The icon to show while indicating data load is in progress.
   */
  loadingIcon?: React.ReactNode | undefined;
  /**
   * Defines whether metaKey is requred or not for the selection. When true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically.
   * @defaultValue true
   */
  metaKeySelection?: boolean | undefined;
  /**
   * An array of SortMeta objects to sort the data by default in multiple sort mode.
   */
  multiSortMeta?: DataTableSortMeta[] | null | undefined;
  /**
   * Number of page links to display.
   * @defaultValue 5
   */
  pageLinkSize?: number | undefined;
  /**
   * When specified as true, enables the pagination.
   * @defaultValue false
   */
  paginator?: boolean | undefined;
  /**
   * Style class of the paginator element.
   */
  paginatorClassName?: string | undefined;
  /**
   * DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element and 'self'. The self value is used to render a component where it is located.
   * @defaultValue document.body
   */
  paginatorDropdownAppendTo?: 'self' | HTMLElement | null | undefined;
  /**
   * Content for the left side of the paginator.
   */
  paginatorLeft?: React.ReactNode | undefined;
  /**
   * Position of the paginator, options are "top","bottom" or "both".
   * @defaultValue bottom
   */
  paginatorPosition?: 'top' | 'bottom' | 'both' | undefined;
  /**
   * Content for the right side of the paginator.
   */
  paginatorRight?: React.ReactNode | undefined;
  /**
   * Template of the paginator. For details, refer to the template section of the paginator documentation for further options.
   * @defaultValue FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown
   */
  paginatorTemplate?: PaginatorTemplate | undefined;
  /**
   * When enabled, columns can have an un-sorted state.
   * @defaultValue false
   */
  removableSort?: boolean | undefined;
  /**
   * When enabled, columns can be reordered using drag and drop.
   * @defaultValue false
   */
  reorderableColumns?: boolean | undefined;
  /**
   * When enabled, rows can be reordered using drag and drop.
   * @defaultValue false
   */
  reorderableRows?: boolean | undefined;
  /**
   * Defines the reorder indicator down icon.
   */
  reorderIndicatorDownIcon?: React.ReactNode | undefined;
  /**
   * Defines the reorder indicator up icon.
   */
  reorderIndicatorUpIcon?: React.ReactNode | undefined;
  /**
   * When enabled, columns can be resized using drag and drop.
   * @defaultValue false
   */
  resizableColumns?: boolean | undefined;
  /**
   * Defines the responsive mode, valid options are "stack" and "scroll".
   * @defaultValue scroll
   * @deprecated since version 9.2.0
   */
  responsiveLayout?: 'scroll' | 'stack' | undefined;
  /**
   * Icon to display in the row editor cancel button.
   */
  rowEditorCancelIcon?: React.ReactNode | undefined;
  /**
   * Icon to display in the row editor init button.
   */
  rowEditorInitIcon?: React.ReactNode | undefined;
  /**
   * Icon to display in the row editor save button.
   */
  rowEditorSaveIcon?: React.ReactNode | undefined;
  /**
   * Function to provide the content of row group footer.
   */
  rowGroupFooterTemplate?: DataTableRowGroupFooterTemplateType<DataTableValueArray> | undefined;
  /**
   * Function to provide the content of row group header.
   */
  rowGroupHeaderTemplate?: DataTableRowGroupHeaderTemplateType<DataTableValueArray> | undefined;
  /**
   * Defines the row grouping mode, valid values are "subheader" and "rowgroup".
   */
  rowGroupMode?: string | undefined;
  /**
   * When enabled, background of the rows change on hover.
   */
  rowHover?: boolean | undefined;
  /**
   * Number of rows to display per page.
   */
  rows?: number | undefined;
  /**
   * Array of integer values to display inside rows per page dropdown.
   */
  rowsPerPageOptions?: number[] | undefined;
  /**
   * Height of the scroll viewport.
   */
  scrollHeight?: string | undefined;
  /**
   * When specified, enables horizontal and/or vertical scrolling.
   * @defaultValue false
   */
  scrollable?: boolean | undefined;
  /**
   * When specified, selects all rows on page.
   * @defaultValue false
   */
  selectAll?: boolean | undefined;
  /**
   * Determines whether the cell editor will be opened when clicking to select any row on Selection and Cell Edit modes.
   * @defaultValue true
   */
  selectOnEdit?: boolean | undefined;
  /**
   * Selected row in single mode or an array of values in multiple mode.
   * @defaultValue true
   */
  selection?: DataTableSelection<DataTableValueArray> | undefined;
  /**
   * When a selectable row is clicked on RadioButton and Checkbox selection, it automatically decides whether to focus on elements such as checkbox or radio.
   * @defaultValue true
   */
  selectionAutoFocus?: boolean | undefined;
  /**
   * A field property from the row to add Select &#123;field&#125; and Unselect &#123;field&#125; ARIA labels to checkbox/radio buttons.
   */
  selectionAriaLabel?: string | undefined;
  /**
   * Specifies the selection mode, valid values are "single", "multiple", "radiobutton" and "checkbox".
   */
  selectionMode?: 'single' | 'multiple' | 'checkbox' | 'radiobutton' | undefined;
  /**
   * When enabled with paginator and checkbox selection mode, the select all checkbox in the header will select all rows on the current page.
   * @defaultValue false
   */
  selectionPageOnly?: boolean | undefined;
  /**
   * Whether to show grid lines between cells.
   * @defaultValue false
   */
  showGridlines?: boolean | undefined;
  /**
   * Whether to show headers.
   * @defaultValue true
   */
  showHeaders?: boolean | undefined;
  /**
   * Whether to show the select all checkbox inside the datatable's header.
   */
  showSelectAll?: boolean | undefined;
  /**
   * Define to set alternative sizes. Valid values: "small", "normal" and "large".
   * @defaultValue normal
   */
  size?: 'small' | 'normal' | 'large' | undefined;
  sortedColumn?: SortedColumn;
  /**
   * Defines whether sorting works on single column or on multiple columns.
   * @defaultValue single
   */
  sortMode?: 'single' | 'multiple' | undefined;
  /**
   * Icon to display the current sorting status.
   */
  sortIcon?: React.ReactNode | undefined;
  /**
   * Unique identifier of a stateful table to use in state storage.
   */
  stateKey?: string | undefined;
  /**
   * Defines where a stateful table keeps its state, valid values are "session" for sessionStorage, "local" for localStorage and "custom".
   * @defaultValue session
   */
  stateStorage?: 'session' | 'local' | 'custom' | undefined;
  /**
   * Whether to displays rows with alternating colors.
   * @defaultValue false
   */
  stripedRows?: boolean | undefined;
  /**
   * Inline style of the component.
   */
  style?: React.CSSProperties | undefined;
  /**
   * Index of the element in tabbing order.
   */
  tabIndex?: number | undefined;
  /**
   * Style class of the table element.
   */
  tableClassName?: string | undefined;
  /**
   * Inline style of the table element.
   */
  tableStyle?: React.CSSProperties | undefined;

  /**
   * Whether to use the virtualScroller feature. The properties of VirtualScroller component can be used like an object in it.
   *
   * Note: Currently only vertical orientation mode is supported.
   */
  virtualScrollerOptions?: VirtualScrollerProps | undefined;
  /**
   * Function that takes the cell data and returns an object in &#123;'styleclass' : condition&#125; format to define a classname for a particular now.
   * @param {*} value - Value of the cell.
   * @param {DataTableCellClassNameOptions<DataTableValueArray>} options - ClassName options.
   * @return {object | string | undefined} A string or object to define a classname for a particular cell.
   */
  cellClassName?(value: any, options: DataTableCellClassNameOptions<DataTableValueArray>): object | string | undefined;
  /**
   * A function to implement custom restoreState with stateStorage="custom". Need to return state object.
   * @return {object | undefined} Returns the state object.
   */
  customRestoreState?(): object | undefined;
  /**
   * A function to implement custom saveState with stateStorage="custom".
   * @param {object} state - The object to be stored.
   */
  customSaveState?(state: object): void;
  /**
   * Function that returns a boolean to decide whether the data should be selectable.
   * @param {DataTableDataSelectableEvent<DataTableValueArray>} event - Custom data selectable event.
   */
  isDataSelectable?(event: DataTableDataSelectableEvent): boolean | undefined | null;
  /**
   * Callback to invoke when all rows are selected using the header checkbox.
   * @param {DataTableSelectEvent} event - Custom select event.
   */
  onAllRowsSelect?(event: DataTableSelectEvent): void;
  /**
   * Callback to invoke when all rows are unselected using the header checkbox.
   * @param {DataTableUnselectEvent} event - Custom unselect event.
   */
  onAllRowsUnselect?(event: DataTableUnselectEvent): void;
  /**
   * Callback to invoke on cell click.
   * @param {DataTableCellClickEvent<DataTableValueArray>} event - Custom cell click event.
   */
  onCellClick?(event: DataTableCellClickEvent<DataTableValueArray>): void;
  /**
   * Callback to invoke on cell select.
   * @param {DataTableCellClickEvent<DataTableValueArray>} event - Custom select event.
   */
  onCellSelect?(event: DataTableCellClickEvent<DataTableValueArray>): void;
  /**
   * Callback to invoke on cell unselect.
   * @param {DataTableCellClickEvent<DataTableValueArray>} event - Custom unselect event.
   */
  onCellUnselect?(event: DataTableCellClickEvent<DataTableValueArray>): void;
  /**
   * Callback to invoke when a column is reordered.
   * @param {DataTableColReorderEvent} event - Custom column reorder event.
   */
  onColReorder?(event: DataTableColReorderEvent): void;
  /**
   * Callback to invoke when a column is resized.
   * @param {DataTableColumnResizeEndEvent} event - Custom column resize end event.
   */
  onColumnResizeEnd?(event: DataTableColumnResizeEndEvent): void;
  /**
   * Callback to invoke when a resizer element is clicked.
   * @param {DataTableColumnResizerClickEvent} event - Custom column resizer click event.
   */
  onColumnResizerClick?(event: DataTableColumnResizerClickEvent): void;
  /**
   * Callback to invoke when a resizer element is double clicked.
   * @param {DataTableColumnResizerClickEvent} event - Custom column resizer double click event.
   */
  onColumnResizerDoubleClick?(event: DataTableColumnResizerClickEvent): void;
  /**
   * Callback to invoke when a context menu is clicked.
   * @param {DataTableRowEvent} event - Custom row event.
   */
  onContextMenu?(event: DataTableRowEvent): void;
  /**
   * Callback to invoke when a row selected with right click.
   * @param {DataTableRowEvent} event - Custom row event.
   */
  onContextMenuSelectionChange?(event: DataTableContextMenuSelectionChangeEvent<DataTableValueArray>): void;
  /**
   * Callback to invoke on filtering.
   * @param {DataTableStateEvent} event - Custom state event.
   */
  onFilter?(event: DataTableStateEvent): void;
  /**
   * Callback to invoke on pagination.
   * @param {DataTableStateEvent} event - Custom state event.
   */
  onPage(event: DataTableStateEvent): void;
  /**
   * Callback to invoke when a row is clicked.
   * @param {DataTableRowClickEvent} event - Custom row click event.
   */
  onRowClick?(event: DataTableRowClickEvent): void;
  /**
   * Callback to invoke when a row is collapsed.
   * @param {DataTableRowEvent} event - Custom row event.
   */
  onRowCollapse?(event: DataTableRowEvent): void;
  /**
   * Callback to invoke when a row is double clicked.
   * @param {DataTableRowClickEvent} event - Custom click event.
   */
  onRowDoubleClick?(event: DataTableRowClickEvent): void;
  /**
   * Callback to invoke when the cancel icon is clicked on row editing mode.
   * @param {DataTableRowEditEvent} event - Custom row edit event.
   */
  onRowEditCancel?(event: DataTableRowEditEvent): void;
  /**
   * Callback to invoke when the cancel icon is clicked on row editing mode.
   * @param {DataTableRowEditEvent} event - Custom row edit event.
   */
  onRowEditChange?(event: DataTableRowEditEvent): void;
  /**
   * Callback to invoke when row edit is completed.
   * @param {DataTableRowEditCompleteEvent} event - Custom row edit complete event.
   */
  onRowEditComplete?(event: DataTableRowEditCompleteEvent): void;
  /**
   * Callback to invoke when the editing icon is clicked on row editing mode.
   * @param {DataTableRowEditEvent} event - Custom row edit event.
   */
  onRowEditInit?(event: DataTableRowEditEvent): void;
  /**
   * Callback to invoke when the save icon is clicked on row editing mode.
   * @param {DataTableRowEditSaveEvent} event - Custom row edit save event.
   */
  onRowEditSave?(event: DataTableRowEditSaveEvent): void;
  /**
   * Callback to invoke when a row is expanded.
   * @param {DataTableRowEvent} event - Custom row event.
   */
  onRowExpand?(event: DataTableRowEvent): void;
  /**
   * Callback to invoke when a row is hovered with mouse.
   * @param {DataTableRowMouseEvent} event - Custom row mouse event.
   */
  onRowMouseEnter?(event: DataTableRowMouseEvent): void;
  /**
   * Callback to invoke when a row is navigated away from with mouse.
   * @param {DataTableRowMouseEvent} event - Custom row mouse event.
   */
  onRowMouseLeave?(event: DataTableRowMouseEvent): void;
  /**
   * Callback to update the new order.
   * @param {DataTableRowReorderEvent<DataTableValueArray>} event - Custom row reorder event.
   */
  onRowReorder?(event: DataTableRowReorderEvent<DataTableValueArray>): void;
  /**
   * Callback to invoke when a row is selected.
   * @param {DataTableSelectEvent} event - Custom select event.
   */
  onRowSelect?(event: DataTableSelectEvent): void;
  /**
   * Callback to invoke when a row is toggled or collapsed.
   * @param {DataTableRowToggleEvent} event - Custom row toggle event.
   */
  onRowToggle?(event: DataTableRowToggleEvent): void;
  /**
   * Callback to invoke when a row is unselected.
   * @param {DataTableUnselectEvent} event - Custom unselect event.
   */
  onRowUnselect?(event: DataTableUnselectEvent): void;
  /**
   * Callback to invoke when select all value changes.
   * @param {DataTableSelectAllChangeEvent} event - Custom select all change event.
   */
  onSelectAllChange?(event: DataTableSelectAllChangeEvent): void;
  /**
   * Callback to invoke when selection changes.
   * @param {DataTableSelectionChangeEvent<DataTableValueArray>} event - Custom selection change event.
   */
  onSelectionChange?(event: DataTableSelectionChangeEvent<DataTableValueArray>): void;
  /**
   * Callback to invoke on sort.
   * @param {DataTableStateEvent} event - Custom state event.
   */
  onSort?(event: DataTableStateEvent): void;
  /**
   * Callback to invoke table state is restored.
   * @param {object} state - Table state.
   */
  onStateRestore?(state: object): void;
  /**
   * Callback to invoke table state is saved.
   * @param {object} state - Table state.
   */
  onStateSave?(state: object): void;
  /**
   * Callback to invoke after filtering and sorting to pass the rendered value.
   * @param {DataTableRowDataArray<DataTableValueArray>} value - Value displayed by the table.
   */
  onValueChange?(value: DataTableRowDataArray<DataTableValueArray>): void;
  /**
   * Function that takes the row data and returns an object in &#123;'styleclass' : condition&#125; format to define a classname for a particular now.
   * @param {DataTableRowData<DataTableValueArray>} data - Value displayed by the table.
   */
  rowClassName?(
    data: DataTableRowData<DataTableValueArray>,
    options: DataTableRowClassNameOptions<DataTableValueArray>,
  ): object | string | undefined;
  /**
   * Callback to invoke to validate the editing row when the save icon is clicked on row editing mode.
   * @param {DataTableRowData<DataTableValueArray>} data - Editing row data.
   */
  rowEditValidator?(
    data: DataTableRowData<DataTableValueArray>,
    options: DataTableRowEditValidatorOptions<DataTableValueArray>,
  ): boolean | undefined;
  /**
   * Function that receives the row data as the parameter and returns the expanded row content. You can override the rendering of the content by setting options.customRendering = true.
   * @param {DataTableRowData<DataTableValueArray>} data - Editing row data.
   * @param {DataTableRowExpansionTemplate} options - Options for the row expansion template.
   */
  rowExpansionTemplate?(
    data: DataTableRowData<DataTableValueArray>,
    options: DataTableRowExpansionTemplate,
  ): React.ReactNode;
  /**
   * Function that returns a boolean by passing the row data to decide if the row reorder element should be displayed per row.
   * @param {DataTableRowData<DataTableValueArray>} data - Editing row data.
   * @param {DataTableShowRowReorderElementOptions} options - Options for the row reorder element.
   */
  showRowReorderElement?(
    data: DataTableRowData<DataTableValueArray>,
    options: DataTableShowRowReorderElementOptions<DataTableValueArray>,
  ): boolean | undefined | null;
  /**
   * Function that returns a boolean by passing the row data to decide if the radio or checkbox should be displayed per row.
   * @param {DataTableRowData<DataTableValueArray>} data - Editing row data.
   * @param {DataTableShowSelectionElementOptions} options - Options for the row reorder element.
   */
  showSelectionElement?(
    data: DataTableRowData<DataTableValueArray>,
    options: DataTableShowSelectionElementOptions<DataTableValueArray>,
  ): boolean | undefined | null;
  /**
   * Used to get the child elements of the component.
   * @readonly
   */
  children?: React.ReactNode | undefined;
  /**
   * Uses to pass attributes to DOM elements inside the component.
   * @type {DataTablePassThroughOptions}
   */
  pt?: DataTablePassThroughOptions;
};
