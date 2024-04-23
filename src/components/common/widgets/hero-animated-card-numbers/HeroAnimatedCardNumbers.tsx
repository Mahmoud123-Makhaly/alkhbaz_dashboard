'use client';

import React from 'react';
import CountUp from 'react-countup';
import { Card, CardBody } from 'reactstrap';

import HeroAnimatedCardNumbersSkeleton from './HeroAnimatedCardNumbersSkeleton';

export interface IHeroAnimatedCardNumbersProps {
  isLoading?: boolean;
  title?: string;
  count?: number;
  icon?: React.ReactNode;
  isDecimal?: boolean;
  prefix?: string;
  separator?: string;
  suffix?: string;
  deviation?: { type: 'up' | 'down'; value: number | string; hint: string };
}
const HeroAnimatedCardNumbers = ({
  isDecimal = true,
  isLoading = true,
  separator,
  prefix,
  suffix,
  ...props
}: IHeroAnimatedCardNumbersProps) => {
  const { title, count, icon, deviation } = props;
  return (
    <React.Fragment>
      {!isLoading && (
        <Card className="card-animate">
          <CardBody>
            <div className="d-flex align-items-center">
              <div className="flex-grow-1 overflow-hidden">
                <p className="text-uppercase fw-medium text-muted text-truncate mb-0">{title}</p>
              </div>
              <div className="flex-shrink-0">
                {/* <h5 className={'fs-14 mb-0 text-' + item.badgeClass}>
                    {item.badge ? <i className={'fs-13 align-middle ' + item.badge}></i> : null} {item.percentage} %
                  </h5> */}
              </div>
            </div>
            <div className="d-flex align-items-end justify-content-between mt-4">
              <div>
                <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                  <span className="counter-value" data-target="559.25">
                    <CountUp
                      start={0}
                      prefix={prefix}
                      suffix={suffix}
                      separator={separator}
                      end={count!}
                      decimals={isDecimal ? 2 : 0}
                      duration={4}
                    />
                  </span>
                </h4>
              </div>
              <div className="avatar-sm flex-shrink-0">{icon}</div>
            </div>
          </CardBody>
        </Card>
      )}
      {isLoading && <HeroAnimatedCardNumbersSkeleton />}
    </React.Fragment>
  );
};
export default HeroAnimatedCardNumbers;
