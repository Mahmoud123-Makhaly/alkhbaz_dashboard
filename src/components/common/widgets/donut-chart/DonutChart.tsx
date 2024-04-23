'use client';

import React, { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';

import getChartColorsArray from '@components/common/ChartsDynamicColor';
import { ApexChart } from '@components/common';
import { useTranslate } from '@app/hooks';

import { IDonutChartProps } from './DonutChart.type';

const DonutChart = ({
  data,
  options,
  size,
  hideToolbar,
  filename,
  enabledDataLabels = true,
  dataColors,
  yAxesFormatter,
}: IDonutChartProps) => {
  const t = useTranslate('COMP_WIDGET_DonutChart');
  var chartPyramidColors = dataColors
    ? getChartColorsArray(dataColors)
    : ['#101828', '#912018', '#1E284B', '#93370D', '#045A82', '#05603A', '#1849A9', '#A11043', '#2D31A6', '#9C2A10'];

  const [series, setSeries] = useState<{ options: ApexOptions; data?: Array<number> }>({
    options: {
      chart: {
        width: 380,
        type: 'donut',
        toolbar: {
          show: !hideToolbar,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: true,
          },
          export: {
            csv: {
              filename: filename,
            },
            svg: {
              filename: filename,
            },
            png: {
              filename: filename,
            },
          },
          autoSelected: 'zoom',
        },
      },
      colors: chartPyramidColors,
      plotOptions: {
        pie: {
          donut: {
            size: size || '60%',
          },
        },
      },
      dataLabels: {
        enabled: enabledDataLabels,
      },
      tooltip: {
        y: {
          formatter: (val: number, opts?: any): string => {
            if (yAxesFormatter) return yAxesFormatter(val, opts);
            else return val.toString();
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      ...options,
      noData: {
        text: t('NO_DATA'),
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: undefined,
          fontSize: '14px',
          fontFamily: undefined,
        },
      },
    },
  });

  useEffect(() => {
    if (data) {
      setSeries(prev => ({
        options: { ...prev.options, labels: data?.map(x => x.label || '') },
        data: data?.map(x => x.value || 0),
      }));
    }
  }, [data]);

  return (
    <React.Fragment>
      {series && series.data && (
        <div className="h-100">
          <ApexChart
            dir="ltr"
            className="apex-charts"
            series={series.data}
            options={series.options}
            type="donut"
            height={350}
          />
        </div>
      )}
    </React.Fragment>
  );
};
export default DonutChart;
