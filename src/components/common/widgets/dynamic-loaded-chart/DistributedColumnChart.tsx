'use client';

import React, { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import { IDistributedColumnChartProps, IDistributedColumnChartSeries } from './DistributedColumnChart.type';
import { Button } from 'reactstrap';

import getChartColorsArray from '@components/common/ChartsDynamicColor';
import { ApexChart } from '@components/common';
import { useTranslate } from '@app/hooks';

const DistributedColumnChart = ({
  data,
  allowDrillingDown,
  options,
  horizontal,
  barLabelOrientation,
  viewLegend,
  colorsDistributed,
  chartType = 'bar',
  dataColors,
  yAxesFormatter,
  xAxesFormatter,
  barDataLabelsFormatter,
}: IDistributedColumnChartProps) => {
  const [series, setSeries] = useState<{ data?: Array<IDistributedColumnChartSeries>; isChildren?: boolean }>();
  const t = useTranslate('COMP_WIDGET_DistributedColumnChart');

  var chartColumnDistributedColors = dataColors
    ? getChartColorsArray(dataColors)
    : ['#101828', '#912018', '#1E284B', '#93370D', '#045A82', '#05603A', '#1849A9', '#A11043', '#2D31A6', '#9C2A10'];

  const onSelectPoint = (e, sourceChart, opts) => {
    if (allowDrillingDown && sourceChart.w.globals.selectedDataPoints[0] && opts.seriesIndex >= 0) {
      var seriesIndex = 0;
      var selectedPoints = sourceChart.w.globals.selectedDataPoints;
      for (var i = 0; i < selectedPoints[seriesIndex].length; i++) {
        var selectedIndex = selectedPoints[seriesIndex][i];
        var selectedSeries = sourceChart.w.config.series[seriesIndex];

        if (selectedSeries.data[selectedIndex] && selectedSeries.data[selectedIndex].meta)
          setSeries({
            isChildren: true,
            data: [
              {
                name: selectedSeries.data[selectedIndex].meta.name || selectedSeries.data[selectedIndex].name || '#',
                data: selectedSeries.data[selectedIndex].meta.data,
              },
            ],
          });
      }
    }
  };

  const dataPointMouseEnter = (event, chartContext, config) => {
    if (allowDrillingDown && chartContext.w.config.series[0] && config.dataPointIndex >= 0) {
      var selectedSeries = chartContext.w.config.series[0];

      if (selectedSeries.data[config.dataPointIndex].meta) event.target.style.cursor = 'pointer';
      else event.target.style.cursor = 'normal';
    }
  };

  const defaultLegendOptions: ApexLegend = {
    show: true,
    horizontalAlign: 'center',
    offsetX: 0,
    offsetY: -5,
    markers: {
      width: 9,
      height: 9,
      radius: 6,
    },
    itemMargin: {
      horizontal: 10,
      vertical: 0,
    },
  };

  var defaultOptions: ApexOptions = {
    chart: {
      id: 'DistributedColumnChartChart',
      height: 350,
      type: chartType,
      events: {
        click: onSelectPoint,
        dataPointMouseEnter: dataPointMouseEnter,
        dataPointMouseLeave: event => (event.target.style.cursor = 'normal'),
      },
    },
    colors: chartColumnDistributedColors,
    plotOptions: {
      bar: {
        horizontal,
        columnWidth: '60%',
        barHeight: '70%',
        distributed: colorsDistributed,
        dataLabels: {
          orientation: barLabelOrientation || 'horizontal',
          position: 'center', // bottom/center/top
        },
      },
    },
    dataLabels: {
      formatter: (val: string | number | number[], opts?: any): string | number => {
        if (barDataLabelsFormatter) return barDataLabelsFormatter(val, opts);
        else return (val || 0).toString();
      },
      enabled: true,
    },
    xaxis: {
      labels: {
        formatter: (val: string, timestamp?: number | undefined, opts?: any): string | string[] => {
          if (xAxesFormatter) return xAxesFormatter(val, timestamp, opts);
          else return (val || 0).toString();
        },
        style: {
          colors: chartColumnDistributedColors,
          fontSize: '15px',
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number, opts?: any): string | string[] => {
          if (yAxesFormatter) return yAxesFormatter(val, opts);
          else return (val || 0).toString();
        },
        style: {
          colors: chartColumnDistributedColors,
          fontSize: '15px',
          fontWeight: 400,
        },
      },
    },
    tooltip: {
      enabled: true,
    },
    legend: viewLegend
      ? defaultLegendOptions
      : {
          show: false,
        },
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
  };

  useEffect(() => {
    setSeries({ data });
  }, [data]);
  // const updateChart = (destChartIDToUpdate, series) => {
  //   console.log({ data });
  //   ApexCharts.exec(destChartIDToUpdate, 'updateSeries', [...[], ...series]);
  // };

  return (
    <React.Fragment>
      {series && (
        <div className="h-100">
          {allowDrillingDown && series.isChildren && (
            <Button size="sm" color="primary" outline onClick={() => setSeries({ data })}>
              <i className="ri-arrow-go-back-line align-bottom"></i>
            </Button>
          )}
          <ApexChart
            dir="ltr"
            type={chartType}
            className="apex-charts"
            series={series.data}
            options={defaultOptions}
            height={350}
          />
        </div>
      )}
    </React.Fragment>
  );
};
export default DistributedColumnChart;
