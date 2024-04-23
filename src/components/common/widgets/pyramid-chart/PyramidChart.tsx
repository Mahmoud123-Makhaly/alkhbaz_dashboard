'use client';

import React, { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import { Button } from 'reactstrap';

import getChartColorsArray from '@components/common/ChartsDynamicColor';
import { ApexChart } from '@components/common';
import { useTranslate } from '@app/hooks';

import { IPyramidChartProps, IPyramidChartSeries } from './PyramidChart.type';

const PyramidChart = ({
  data,
  allowDrillingDown,
  options,
  dataColors = ['--vz-primary', '--vz-success', '--vz-warning', '--vz-danger', '--vz-dark', '--vz-info'],
}: IPyramidChartProps) => {
  const [series, setSeries] = useState<{ data?: Array<IPyramidChartSeries>; isChildren?: boolean }>();
  const t = useTranslate('COMP_WIDGET_PyramidChart');

  var chartPyramidColors = getChartColorsArray(dataColors);

  const onSelectPoint = (e, sourceChart, opts) => {
    if (sourceChart.w.globals.selectedDataPoints[0] && opts.seriesIndex >= 0) {
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
    if (chartContext.w.config.series[0] && config.dataPointIndex >= 0) {
      var selectedSeries = chartContext.w.config.series[0];

      if (selectedSeries.data[config.dataPointIndex].meta) event.target.style.cursor = 'pointer';
      else event.target.style.cursor = 'normal';
    }
  };

  var defaultOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      events: {
        click: onSelectPoint,
        dataPointMouseEnter: dataPointMouseEnter,
        dataPointMouseLeave: event => (event.target.style.cursor = 'normal'),
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        horizontal: true,
        distributed: true,
        barHeight: '80%',
        isFunnel: true,
      },
    },
    colors: chartPyramidColors,
    dataLabels: {
      enabled: true,
      formatter: (val, opt) => opt.w.globals.labels[opt.dataPointIndex],
      dropShadow: {
        enabled: true,
      },
    },
    legend: {
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
            className="apex-charts"
            series={series.data}
            options={defaultOptions}
            type="bar"
            height={350}
          />
        </div>
      )}
    </React.Fragment>
  );
};
export default PyramidChart;
