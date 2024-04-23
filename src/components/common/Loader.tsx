'use client';

import { useEffect } from 'react';
import { useToast } from '@app/hooks';

const Loader = props => {
  const toast = useToast();
  useEffect(() => {
    if (props.error) toast.error(props.error);
  }, [props.error, toast]);
  return (
    <div className="preloader">
      <div className="status">
        <div className="spinner-border text-primary avatar-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
