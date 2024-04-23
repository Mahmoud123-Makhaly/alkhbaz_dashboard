import { useSession } from 'next-auth/react';
import { Utils } from '@helpers/utils';
import { SecurityUserRoles } from '@helpers/constants';
import React from 'react';

const IsAuthorizedTo = (Component, allowedRoles: Array<SecurityUserRoles>) => {
  const { data: session } = useSession();
  if (!session || !session.user || !session.user.roles) {
    return <i className="ri-lock-fill fs-ri-lock-fill text-danger" />;
  }

  return (
    <React.Fragment>
      {Utils.isSubsetOfArray(allowedRoles, session.user.roles) ? (
        Component
      ) : (
        <i className="ri-lock-fill fs-ri-lock-fill text-danger" />
      )}
    </React.Fragment>
  );
};
export default IsAuthorizedTo;
