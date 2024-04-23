import { ApexOptions } from 'apexcharts';

export interface IDistributedColumnChartSeriesItem {
  x: string;
  y: any;
  meta?: Array<IDistributedColumnChartSeries>;
}

export interface IDistributedColumnChartSeries {
  name?: string;
  type?: 'area' | 'bar' | 'line';
  data: Array<IDistributedColumnChartSeriesItem>;
}

export interface IDistributedColumnChartProps {
  data?: Array<IDistributedColumnChartSeries>;
  options?: Omit<ApexOptions, 'series' | 'labels'>;
  horizontal?: boolean;
  dataColors?: Array<string>;
  allowDrillingDown?: boolean;
  barLabelOrientation?: 'horizontal' | 'vertical' | undefined;
  viewLegend?: boolean;
  chartType?: 'area' | 'bar' | 'line';
  colorsDistributed?: boolean;
  yAxesFormatter?: (val: number, opts?: any) => string | string[];
  xAxesFormatter?: (val: string, timestamp?: number | undefined, opts?: any) => string | string[];
  barDataLabelsFormatter?: (val: string | number | number[], opts?: any) => string | number;
}
