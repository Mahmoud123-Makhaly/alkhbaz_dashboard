import { ApexOptions } from 'apexcharts';

export interface IDonutChartSeries {
  label: string;
  value: number;
}

export interface IDonutChartProps {
  data?: Array<IDonutChartSeries>;
  options?: Omit<ApexOptions, 'series' | 'labels'>;
  dataColors?: Array<string>;
  size?: string;
  enabledDataLabels?: boolean;
  hideToolbar?: boolean;
  filename?:string;
  yAxesFormatter?: (val: number, opts?: any) => string;
}
