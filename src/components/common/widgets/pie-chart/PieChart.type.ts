import { ApexOptions } from 'apexcharts';

export interface IPieChartSeries {
  label: string;
  value: number;
}

export interface IPieChartProps {
  data?: Array<IPieChartSeries>;
  options?: Omit<ApexOptions, 'series' | 'labels'>;
  dataColors?: Array<string>;
  yAxesFormatter?: (val: number, opts?: any) => string;
}
