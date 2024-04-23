'use client';

import React from 'react';
import CountUp from 'react-countup';
import { Card, CardBody } from 'reactstrap';
import MiniAttachedAnimatedCardNumbersSkeleton from './MiniAttachedAnimatedCardNumbersSkeleton';

export interface IMiniAttachedAnimatedCardNumbersProps {
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
const MiniAttachedAnimatedCardNumbers = ({
  isDecimal = true,
  isLoading = true,
  separator,
  prefix,
  suffix,
  ...props
}: IMiniAttachedAnimatedCardNumbersProps) => {
  const { title, count, icon, deviation } = props;
  return (
    <React.Fragment>
      {!isLoading && (
        <div className="py-4 px-3">
          <h5 className="card-title fs-13">{title}</h5>
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0">{icon}</div>
            <div className="flex-grow-1 ms-3">
              <h2 className="mb-0">
                <span className="counter-value" data-target="197">
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
              </h2>
            </div>
          </div>
        </div>
      )}
      {isLoading && <MiniAttachedAnimatedCardNumbersSkeleton />}
    </React.Fragment>
  );
};
export default MiniAttachedAnimatedCardNumbers;
