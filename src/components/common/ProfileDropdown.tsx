'use client';

import React, { useState } from 'react';
import Link from 'next-intl/link';
import Image from 'next/image';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { signOut, useSession } from 'next-auth/react';
import { useTranslate } from '@app/hooks';

//import images
import DummyImg from '@assets/img/users/al_khbaz-sm.png';

const ProfileDropdown = () => {
  const { data: session } = useSession();
  const t = useTranslate('COMP_ProfileDropdown');
  const handleSignOut = () =>
    signOut({
      callbackUrl: `${window.location.origin}`,
    });

  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };
  return (
    <React.Fragment>
      {!session?.error ? (
        <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
          <DropdownToggle tag="button" type="button" className="btn">
            <span className="d-flex align-items-center">
              <Image
                className="rounded-circle header-profile-user"
                src={DummyImg.src}
                width={0}
                height={0}
                alt="Header Avatar"
                loading="lazy"
                sizes="100vw"
                style={{ height: 'auto' }}
              />
              <span className="text-start ms-xl-2">
                <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{session?.user.userName}</span>
                <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text"></span>
              </span>
            </span>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <h6 className="dropdown-header">
              {t('Welcome')} {session?.user.userName}!
            </h6>
            <DropdownItem className="p-0">
              <Link href={process.env.NEXT_PUBLIC_PUBLIC_URL + '/profile'} className="dropdown-item">
                <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                <span className="align-middle">{t('Profile')}</span>
              </Link>
            </DropdownItem>
            <DropdownItem className="p-0">
              <Link
                href="#"
                onClick={e => {
                  e.preventDefault();
                  handleSignOut();
                }}
                className="dropdown-item"
              >
                <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                <span className="align-middle" data-key="t-logout">
                  {t('Logout')}
                </span>
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        handleSignOut()
      )}
    </React.Fragment>
  );
};

export default ProfileDropdown;
