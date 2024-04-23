'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { usePathname, useRouter } from 'next-intl/client';
import { useSession } from 'next-auth/react';

import {
  changeLayout,
  changeSidebarTheme,
  changeLayoutMode,
  changeLayoutWidth,
  changeLayoutPosition,
  changeTopbarTheme,
  changeLeftsidebarSizeType,
  changeLeftsidebarViewType,
  changeSidebarImageType,
  changeSidebarVisibility,
} from '@slices/thunks';
import { Utils } from '@helpers/utils';
import { sysPaths } from '@helpers/constants';
import { ClientOnly } from '@components/common';

import menuData from './LayoutMenuData';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
// import RightSidebar from '@components/common/RightSidebar';

const Layout = props => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const navData = menuData().props.children;
  const navDataLinks = Utils.extractNavDataProp(navData, 'link');
  const { children, locale } = props;
  const [headerClass, setHeaderClass] = useState('');
  const dispatch = useDispatch();
  const {
    layoutType,
    leftSidebarType,
    layoutModeType,
    layoutWidthType,
    layoutPositionType,
    topbarThemeType,
    leftsidbarSizeType,
    leftSidebarViewType,
    leftSidebarImageType,
    sidebarVisibilitytype,
  } = useSelector<any, any>(state => ({
    layoutType: state.Layout.layoutType,
    leftSidebarType: state.Layout.leftSidebarType,
    layoutModeType: state.Layout.layoutModeType,
    layoutWidthType: state.Layout.layoutWidthType,
    layoutPositionType: state.Layout.layoutPositionType,
    topbarThemeType: state.Layout.topbarThemeType,
    leftsidbarSizeType: state.Layout.leftsidbarSizeType,
    leftSidebarViewType: state.Layout.leftSidebarViewType,
    leftSidebarImageType: state.Layout.leftSidebarImageType,
    sidebarVisibilitytype: state.Layout.sidebarVisibilitytype,
  }));

  /*
    layout settings
    */
  useEffect(() => {
    if (window != undefined) {
      if (
        layoutType ||
        leftSidebarType ||
        layoutModeType ||
        layoutWidthType ||
        layoutPositionType ||
        topbarThemeType ||
        leftsidbarSizeType ||
        leftSidebarViewType ||
        leftSidebarImageType ||
        sidebarVisibilitytype
      ) {
        window.dispatchEvent(new Event('resize'));
        dispatch(changeLeftsidebarViewType(leftSidebarViewType) as unknown as AnyAction);
        dispatch(changeLeftsidebarSizeType(leftsidbarSizeType) as unknown as AnyAction);
        dispatch(changeSidebarTheme(leftSidebarType) as unknown as AnyAction);
        dispatch(changeLayoutMode(layoutModeType) as unknown as AnyAction);
        dispatch(changeLayoutWidth(layoutWidthType) as unknown as AnyAction);
        dispatch(changeLayoutPosition(layoutPositionType) as unknown as AnyAction);
        dispatch(changeTopbarTheme(topbarThemeType) as unknown as AnyAction);
        dispatch(changeLayout(layoutType) as unknown as AnyAction);
        dispatch(changeSidebarImageType(leftSidebarImageType) as unknown as AnyAction);
        dispatch(changeSidebarVisibility(sidebarVisibilitytype) as unknown as AnyAction);
      }
    }
  }, [
    layoutType,
    leftSidebarType,
    layoutModeType,
    layoutWidthType,
    layoutPositionType,
    topbarThemeType,
    leftsidbarSizeType,
    leftSidebarViewType,
    leftSidebarImageType,
    sidebarVisibilitytype,
    dispatch,
  ]);
  /*
    call dark/light mode
    */
  const onChangeLayoutMode = value => {
    if (changeLayoutMode) {
      dispatch(changeLayoutMode(value) as unknown as AnyAction);
    }
  };

  // class add remove in header
  useEffect(() => {
    window.addEventListener('scroll', scrollNavigation, true);
  });

  function scrollNavigation() {
    var scrollup = document.documentElement.scrollTop;
    if (scrollup > 50) {
      setHeaderClass('topbar-shadow');
    } else {
      setHeaderClass('');
    }
  }

  useEffect(() => {
    if (sidebarVisibilitytype === 'show' || layoutType === 'vertical' || layoutType === 'twocolumn') {
      document.querySelector('.hamburger-icon')?.classList.remove('open');
    } else {
      document.querySelector('.hamburger-icon') && document.querySelector('.hamburger-icon')?.classList.add('open');
    }
  }, [sidebarVisibilitytype, layoutType]);

  useEffect(() => {
    // When the route changes, update the state to reflect if it starts with any 'link' prop value
    const handleRouteChange = () => {
      const startsWithSysPath = sysPaths.some(link => pathName.startsWith(link));
      if (!startsWithSysPath) {
        const startsWith = navDataLinks.some(link => pathName.startsWith(link));
        if (!startsWith) router.replace('/403');
      }
    };

    // Initial check on component mount
    if (session && session.user && session.user.roles && navDataLinks) handleRouteChange();
  }, [navDataLinks, pathName, router, session]);

  return (
    <ClientOnly>
      <div id="layout-wrapper">
        <Header
          headerClass={headerClass}
          layoutModeType={layoutModeType}
          onChangeLayoutMode={onChangeLayoutMode}
          locale={locale}
        />
        <Sidebar layoutType={layoutType} />
        <div className="main-content">
          {children}
          <Footer />
        </div>
      </div>
    </ClientOnly>
  );
};

export default Layout;
