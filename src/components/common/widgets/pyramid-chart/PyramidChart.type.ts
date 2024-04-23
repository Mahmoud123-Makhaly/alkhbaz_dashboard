import { ApexOptions } from 'apexcharts';

export interface IPyramidChartSeriesItem {
  x: string;
  y: any;
  meta?: Array<IPyramidChartSeries>;
}

export interface IPyramidChartSeries {
  name?: string;
  data: Array<IPyramidChartSeriesItem>;
}

export interface IPyramidChartProps {
  data?: Array<IPyramidChartSeries>;
  options?: Omit<ApexOptions, 'series' | 'labels'>;
  dataColors?: Array<string>;
  allowDrillingDown?: boolean;
}
