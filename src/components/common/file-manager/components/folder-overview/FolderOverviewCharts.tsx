'use client';

import React from 'react';

import { ApexChart } from '@components/common';
import getChartColorsArray from '@components/common/ChartsDynamicColor';
import { ApexOptions } from 'apexcharts';
import { IFolderOverviewDonutChartsDataItem } from './FolderOverviewCharts.types';

const OverviewDonutCharts = ({ data }: { data: Array<IFolderOverviewDonutChartsDataItem> }) => {
  var chartDonutBasicColors = getChartColorsArray(data.map(item => item.color));
  const series = data.map(item => item.size);
  var options: ApexOptions = {
    chart: {
      height: 330,
      type: 'donut',
    },
    labels: data.map(item => item.label),
    dataLabels: {
      dropShadow: {
        enabled: false,
      },
    },
    legend: {
      position: 'bottom',
    },
    colors: chartDonutBasicColors,
  };
  return (
    <ApexChart dir="ltr" series={series} options={options} type="donut" height={330} className="apex-charts mt-3" />
  );
};

export default OverviewDonutCharts;
