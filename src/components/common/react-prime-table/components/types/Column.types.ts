import {
  ColumnPassThroughOptions,
  ColumnEditorOptions,
  ColumnFilterApplyTemplateOptions,
  ColumnFilterClearTemplateOptions,
  ColumnFilterElementTemplateOptions,
  ColumnFilterFooterTemplateOptions,
  ColumnFilterHeaderTemplateOptions,
  ColumnFilterMatchModeOptions,
  ColumnFooterOptions,
  ColumnHeaderOptions,
  ColumnProps,
  ColumnEvent,
  ColumnFilterEvent,
  ColumnFilterApplyClickEvent,
  ColumnFilterConstraintAddEvent,
  ColumnFilterConstraintRemoveEvent,
  ColumnFilterMatchModeChangeEvent,
  ColumnFilterOperatorChangeEvent,
  ColumnSortEvent,
  ColumnBodyOptions,
  TooltipOptions,
  IconType,
} from 'primereact';

export type DataTableColumns = {
  /**
   * Aligns the content of the column, valid values are left, right and center.
   */
  align?: 'left' | 'right' | 'center' | undefined | null;
  /**
   * Position of a frozen column, valid values are left and right.
   */
  alignFrozen?: 'left' | 'right' | undefined;
  /**
   * Aligns the header of the column, valid values are left, right and center.
   */
  alignHeader?: 'left' | 'right' | 'center' | undefined | null;
  /**
   * Body content of the column.
   */
  body?: React.ReactNode | ((data: any, options: ColumnBodyOptions) => React.ReactNode);
  /**
   * Style class of the body. If using a function must return a string.
   */
  bodyClassName?: string | ((data: any, options: ColumnBodyOptions) => string);
  /**
   * Inline style of the body.
   */
  bodyStyle?: React.CSSProperties | undefined;
  /**
   * Event to trigger the validation, possible values are "click" and "blur".
   * @defaultValue click
   */
  cellEditValidatorEvent?: string | undefined;
  /**
   * Used to get the child elements of the component.
   * @readonly
   */
  children?: React.ReactNode | undefined;
  /**
   * Uses to pass attributes to DOM elements inside the component.
   * @type {ColumnPassThroughOptions}
   */
  pt?: ColumnPassThroughOptions;
  /**
   * Style class of the component.
   */
  className?: string | undefined;
  /**
   * Number of columns to span for grouping.
   */
  colSpan?: number | undefined;
  /**
   * Identifier of a column if field property is not defined. Only utilized by reorderableColumns feature at the moment.
   */
  columnKey?: string | undefined;
  /**
   * Depending on the dataType of the column, suitable match modes are displayed.
   */
  dataType?: 'text' | 'numeric' | 'date' | string | undefined;
  /**
   * Function to provide the cell editor input.
   */
  editor?: React.ReactNode | ((options: ColumnEditorOptions) => React.ReactNode);
  /**
   * Whether to exclude from global filtering or not.
   * @defaultValue false
   */
  excludeGlobalFilter?: boolean | undefined;
  /**
   * Displays an icon to toggle row expansion.
   * @defaultValue false
   */
  expander?: boolean | ((data: any, options: ColumnBodyOptions) => boolean);
  /**
   * Defines whether the column is exported or not.
   * @defaultValue true
   */
  exportable?: boolean | undefined;
  /**
   * Property of a row data used for exporting, defaults to field.
   */
  exportField?: string | undefined;
  /**
   * Custom export header of the column to be exported.
   */
  exportHeader?: string | undefined;
  /**
   * Property of a row data.
   */
  field: string | undefined;
  /**
   * Defines if a column can be filtered.
   * @defaultValue false
   */
  filter?: boolean | undefined;
  /**
   * Template of apply element in menu.
   */
  filterApply?: React.ReactNode | ((options: ColumnFilterApplyTemplateOptions) => React.ReactNode);
  /**
   * Template of clear element in menu.
   */
  filterClear?: React.ReactNode | ((options: ColumnFilterClearTemplateOptions) => React.ReactNode);
  /**
   * Element for custom filtering.
   */
  filterElement?: React.ReactNode | ((options: ColumnFilterElementTemplateOptions) => React.ReactNode);
  /**
   * Property of a row data used for filtering, defaults to field.
   */
  filterField?: string | undefined;
  /**
   * Template of footer element in menu.
   */
  filterFooter?: React.ReactNode | ((options: ColumnFilterFooterTemplateOptions) => React.ReactNode);
  /**
   * Template of header element in menu.
   */
  filterHeader?: React.ReactNode | ((options: ColumnFilterHeaderTemplateOptions) => React.ReactNode);
  /**
   * Style class of the filter header.
   */
  filterHeaderClassName?: string | undefined;
  /**
   * Inline style of the filter header.
   */
  filterHeaderStyle?: React.CSSProperties | undefined;
  /**
   * Defines filterMatchMode; "startsWith", "contains", "endsWith", "equals", "notEquals", "in", "lt", "lte", "gt", "gte" and "custom".
   */
  filterMatchMode?:
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
   * An array of label-value pairs to override the global match mode options.
   */
  filterMatchModeOptions?: ColumnFilterMatchModeOptions[];
  /**
   * Specifies the maximum number of characters allowed in the filter element.
   */
  filterMaxLength?: number | undefined;
  /**
   * Style class of the column filter overlay.
   */
  filterMenuClassName?: string | undefined;
  /**
   * Inline style of the column filter overlay.
   */
  filterMenuStyle?: React.CSSProperties | undefined;
  /**
   * Defines placeholder of the input fields.
   */
  filterPlaceholder?: string | undefined;
  /**
   * Type of the filter input field.
   * @defaultValue text
   */
  filterType?: string | undefined;
  /**
   * Footer content of the table.
   */
  footer?: React.ReactNode | ((options: ColumnFooterOptions) => React.ReactNode);
  /**
   * Style class of the footer.
   */
  footerClassName?: string | undefined;
  /**
   * Inline style of the footer.
   */
  footerStyle?: React.CSSProperties | undefined;
  /**
   * Whether the column is fixed in horizontal scrolling or not.
   * @defaultValue false
   */
  frozen?: boolean | undefined;
  /**
   * Header content of the table.
   */
  header: React.ReactNode | ((options: ColumnHeaderOptions) => React.ReactNode);
  /**
   * Style class of the header.
   */
  headerClassName?: string | undefined;
  /**
   * Inline style of the header.
   */
  headerStyle?: React.CSSProperties | undefined;
  /**
   * Content of the header tooltip.
   */
  headerTooltip?: string | undefined;
  /**
   * Configuration of the header tooltip, refer to the tooltip documentation for more information.
   */
  headerTooltipOptions?: TooltipOptions | undefined;
  /**
   * Whether the column is rendered.
   * @defaultValue false
   */
  hidden?: boolean | undefined;
  /**
   * Maximum number of constraints for a column filter.
   * @defaultValue 2
   */
  maxConstraints?: number | undefined;
  /**
   * Used to defined reorderableColumns per column when reorderableColumns of table is enabled, defaults to value of reorderableColumns.
   */
  reorderable?: boolean | undefined;
  /**
   * Used to defined resizeableColumns per column when resizeableColumns of table is enabled, defaults to value of resizeableColumns.
   */
  resizeable?: boolean | undefined;
  /**
   * Displays icons to edit row.
   * @defaultValue false
   */
  rowEditor?: boolean | undefined;
  /**
   * Whether this column displays an icon to reorder the rows.
   * @defaultValue false
   */
  rowReorder?: boolean | undefined;
  /**
   * Icon of the drag handle to reorder rows.
   */
  rowReorderIcon?: IconType<ColumnProps> | undefined;
  /**
   * Number of rows to span for grouping.
   */
  rowSpan?: number | undefined;
  /**
   * Specifies the selection mode, valid values are "single", "multiple", "radiobutton" and "checkbox".
   */
  selectionMode?: 'single' | 'multiple' | undefined;
  /**
   * When enabled, a button is displayed to add more rules.
   * @defaultValue true
   */
  showAddButton?: boolean | undefined;
  /**
   * Displays a button to apply the column filtering.
   * @defaultValue true
   */
  showApplyButton?: boolean | undefined;
  /**
   * Displays a button to clear the column filtering.
   * @defaultValue true
   */
  showClearButton?: boolean | undefined;
  /**
   * Whether to show the match modes selector.
   * @defaultValue true
   */
  showFilterMatchModes?: boolean | undefined;
  /**
   * Whether to display the filter overlay.
   * @defaultValue true
   */
  showFilterMenu?: boolean | undefined;
  /**
   * Whether to show the match modes selector and match operator selector.
   * @defaultValue true
   */
  showFilterMenuOptions?: boolean | undefined;
  /**
   * When enabled, match all and match any operator selector is displayed.
   * @defaultValue true
   */
  showFilterOperator?: boolean | undefined;
  /**
   * Name of the field to sort data by default.
   */
  sortField?: string | undefined;
  /**
   * Defines if a column is sortable.
   * @defaultValue false
   */
  sortable?: boolean | undefined;
  /**
   * When enabled, the data of columns with this property cannot be sorted or changed by the user.
   * @defaultValue false
   */
  sortableDisabled?: boolean | undefined;
  /**
   * Inline style of the component.
   */
  style?: React.CSSProperties | undefined;
  /**
   * Validator function to validate the cell input value.
   * @param {ColumnEvent} event - Custom event.
   */
  cellEditValidator?(event: ColumnEvent): boolean;
  /**
   * Custom filter function.
   * @param {*} value - Value of the filter event.
   * @param {*} filter - Filter of the filter event.
   * @param {*} filterLocale - Filter locale of the event.
   * @param {*} params - Params of the filter event.
   */
  filterFunction?(value: any, filter: any, filterLocale: string, params: ColumnFilterEvent): void;
  /**
   * Callback to invoke before the cell editor is hidden.
   * @param {ColumnEvent} event - Custom event.
   */
  onBeforeCellEditHide?(event: ColumnEvent): void;
  /**
   * Callback to invoke before the cell editor is shown. To prevent editor from showing return false or originalEvent.preventDefault().
   * @param {ColumnEvent} event - Custom event.
   */
  onBeforeCellEditShow?(event: ColumnEvent): void;
  /**
   * Callback to execute when editor is cancelled.
   * @param {ColumnEvent} event - Custom event.
   */
  onCellEditCancel?(event: ColumnEvent): void;
  /**
   * Callback to execute when editor is submitted.
   * @param {ColumnEvent} event - Custom event.
   */
  onCellEditComplete?(event: ColumnEvent): void;
  /**
   * Callback to invoke when cell edit is initiated. To prevent editor from showing return false or originalEvent.preventDefault().
   * @param {ColumnEvent} event - Custom event.
   */
  onCellEditInit?(event: ColumnEvent): void;
  /**
   * Callback to invoke when the apply button is clicked.
   * @param {ColumnFilterApplyClickEvent} event - Custom filter event.
   */
  onFilterApplyClick?(event: ColumnFilterApplyClickEvent): void;
  /**
   * Callback to invoke when the filter meta is cleared.
   */
  onFilterClear?(): void;
  /**
   * Callback to invoke when a new constraint is added.
   * @param {ColumnFilterConstraintAddEvent} event - Custom filter event.
   */
  onFilterConstraintAdd?(event: ColumnFilterConstraintAddEvent): void;
  /**
   * Callback to invoke when a constraint is removed.
   * @param {ColumnFilterConstraintRemoveEvent} event - Custom filter event.
   */
  onFilterConstraintRemove?(event: ColumnFilterConstraintRemoveEvent): void;
  /**
   * Callback to invoke when the match mode option is changed.
   * @param {ColumnFilterMatchModeChangeEvent} event - Custom filter event.
   */
  onFilterMatchModeChange?(event: ColumnFilterMatchModeChangeEvent): void;
  /**
   * Callback to invoke when the filter operator option is changed.
   * @param {ColumnFilterOperatorChangeEvent} event - Custom filter event.
   */
  onFilterOperatorChange?(event: ColumnFilterOperatorChangeEvent): void;
  /**
   * Sort function for custom sorting.
   * @param {ColumnSortEvent} event - Custom sort event.
   */
  sortFunction?(event: ColumnSortEvent): void;
};
