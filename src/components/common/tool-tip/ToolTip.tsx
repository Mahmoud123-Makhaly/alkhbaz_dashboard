'use client';

import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';
import { Placement } from './ToolTip.types';

const ToolTip = ({
  placement,
  msg,
  id,
  children,
}: {
  placement: Placement;
  msg: string;
  id: string;
  children: React.ReactNode;
}) => {
  const [tooltip, setTooltip] = useState(false);

  return (
    <React.Fragment>
      <Tooltip
        placement={placement}
        isOpen={tooltip}
        target={id}
        toggle={() => {
          setTooltip(!tooltip);
        }}
      >
        {msg}
      </Tooltip>
      <div id={id}>{children}</div>
    </React.Fragment>
  );
};
export default ToolTip;
