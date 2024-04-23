import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next-intl/link';
import { usePathname } from 'next-intl/client';
import { useLocale } from 'next-intl';
import { Collapse } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { changePageLoader } from '@slices/thunks';
import { preloaderTypes } from '@components/constants/layout';
import { useTranslate } from '@app/hooks';
// Import Data
import navdata from '../LayoutMenuData';

const VerticalLayout = props => {
  const { layoutType: defaultLayoutType } = props;
  const navData = navdata().props.children;
  const pathName = usePathname();
  const locale = useLocale();
  const t = useTranslate('Menu');
  const dispatch = useDispatch();

  /*
 layout settings
 */
  const { leftsidbarSizeType, sidebarVisibilitytype, layoutType } = useSelector<any, any>(state => ({
    leftsidbarSizeType: state.Layout.leftsidbarSizeType,
    sidebarVisibilitytype: state.Layout.sidebarVisibilitytype,
    layoutType: state.Layout.layoutType,
  }));

  //vertical and semibox resize events
  const resizeSidebarMenu = useCallback(() => {
    var windowSize = document.documentElement.clientWidth;
    if (windowSize >= 1025) {
      if (document.documentElement.getAttribute('data-layout') === 'vertical') {
        document.documentElement.setAttribute('data-sidebar-size', leftsidbarSizeType);
      }
      if (document.documentElement.getAttribute('data-layout') === 'semibox') {
        document.documentElement.setAttribute('data-sidebar-size', leftsidbarSizeType);
      }
      if (
        (sidebarVisibilitytype === 'show' || layoutType === 'vertical' || layoutType === 'twocolumn') &&
        document.querySelector('.hamburger-icon')
      ) {
        document.querySelector('.hamburger-icon')?.classList.remove('open');
      } else {
        document.querySelector('.hamburger-icon')?.classList.add('open');
      }
    } else if (windowSize < 1025 && windowSize > 767) {
      document.body.classList.remove('twocolumn-panel');
      if (document.documentElement.getAttribute('data-layout') === 'vertical') {
        document.documentElement.setAttribute('data-sidebar-size', 'sm');
      }
      if (document.documentElement.getAttribute('data-layout') === 'semibox') {
        document.documentElement.setAttribute('data-sidebar-size', 'sm');
      }
      if (document.querySelector('.hamburger-icon')) {
        document.querySelector('.hamburger-icon')?.classList.add('open');
      }
    } else if (windowSize <= 767) {
      document.body.classList.remove('vertical-sidebar-enable');
      if (document.documentElement.getAttribute('data-layout') !== 'horizontal') {
        document.documentElement.setAttribute('data-sidebar-size', 'lg');
      }
      if (document.querySelector('.hamburger-icon')) {
        document.querySelector('.hamburger-icon')?.classList.add('open');
      }
    }
  }, [leftsidbarSizeType, sidebarVisibilitytype, layoutType]);

  useEffect(() => {
    if (window != undefined) {
      window.addEventListener('resize', resizeSidebarMenu, true);
    }
  }, [resizeSidebarMenu]);

  useEffect(() => {
    if (window != undefined) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      dispatch(changePageLoader(preloaderTypes.DISABLE) as unknown as AnyAction);
      const initMenu = () => {
        const ul = document.getElementById('navbar-nav');
        const items = ul?.getElementsByTagName('a');
        let itemsArray: HTMLAnchorElement[] = [];

        if (items) {
          itemsArray = Array.from(items); // Convert HTMLCollection to array
        } // converts NodeList to Array
        removeActivation(itemsArray);
        let matchingMenuItem = itemsArray.find(x => {
          return x.pathname === `/${locale}${pathName}`;
        });
        if (matchingMenuItem) {
          activateParentDropdown(matchingMenuItem);
        }
      };
      if (defaultLayoutType === 'vertical') {
        initMenu();
      }
    }
  }, [pathName, defaultLayoutType, locale, dispatch]);

  function activateParentDropdown(item) {
    item.classList.add('active');
    let parentCollapseDiv = item.closest('.collapse.menu-dropdown');

    if (parentCollapseDiv) {
      // to set aria expand true remaining
      parentCollapseDiv.classList.add('show');
      parentCollapseDiv.parentElement.children[0].classList.add('active');
      parentCollapseDiv.parentElement.children[0].setAttribute('aria-expanded', 'true');
      if (parentCollapseDiv.parentElement.closest('.collapse.menu-dropdown')) {
        parentCollapseDiv.parentElement.closest('.collapse').classList.add('show');
        if (parentCollapseDiv.parentElement.closest('.collapse').previousElementSibling)
          parentCollapseDiv.parentElement.closest('.collapse').previousElementSibling.classList.add('active');
        if (parentCollapseDiv.parentElement.closest('.collapse').previousElementSibling.closest('.collapse')) {
          parentCollapseDiv.parentElement
            .closest('.collapse')
            .previousElementSibling.closest('.collapse')
            .classList.add('show');
          parentCollapseDiv.parentElement
            .closest('.collapse')
            .previousElementSibling.closest('.collapse')
            .previousElementSibling.classList.add('active');
        }
      }
      return false;
    }
    return false;
  }

  const removeActivation = items => {
    let actiItems = items.filter(x => x.classList.contains('active'));

    actiItems.forEach(item => {
      if (item.classList.contains('menu-link')) {
        if (!item.classList.contains('active')) {
          item.setAttribute('aria-expanded', false);
        }
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove('show');
        }
      }
      if (item.classList.contains('nav-link')) {
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove('show');
        }
        item.setAttribute('aria-expanded', false);
      }
      item.classList.remove('active');
    });
  };

  return (
    <React.Fragment>
      {/* menu Items */}
      {(navData || []).map((item, key) => {
        return (
          <React.Fragment key={key}>
            {/* Main Header */}
            {item['isHeader'] ? (
              <li className="menu-title">
                <span data-key="t-menu">{t(item.label)} </span>
              </li>
            ) : item.subItems ? (
              <li className="nav-item">
                <Link
                  onClick={item.click}
                  className="nav-link menu-link"
                  href={item.link ? item.link : '/#'}
                  data-bs-toggle="collapse"
                >
                  <i className={item.icon}></i>
                  <span data-key="t-apps">{t(item.label)}</span>
                  {item.badgeName ? (
                    <span className={'badge badge-pill bg-' + item.badgeColor} data-key="t-new">
                      {item.badgeName}
                    </span>
                  ) : null}
                </Link>
                <Collapse className="menu-dropdown" isOpen={item.stateVariables} id="sidebarApps">
                  <ul className="nav nav-sm flex-column test">
                    {/* subItms  */}
                    {item.subItems &&
                      (item.subItems || []).map((subItem, key) => (
                        <React.Fragment key={key}>
                          {!subItem.isChildItem ? (
                            <li className="nav-item">
                              <Link
                                href={subItem.link ? subItem.link : '/#'}
                                className="nav-link"
                                onClick={e => {
                                  if (!e.currentTarget.href.endsWith(pathName))
                                    dispatch(changePageLoader(preloaderTypes.ENABLE) as unknown as AnyAction);
                                }}
                              >
                                {t(subItem.label)}
                                {subItem.badgeName ? (
                                  <span className={'badge badge-pill bg-' + subItem.badgeColor} data-key="t-new">
                                    {subItem.badgeName}
                                  </span>
                                ) : null}
                              </Link>
                            </li>
                          ) : (
                            <li className="nav-item">
                              <Link onClick={subItem.click} className="nav-link" href="/#" data-bs-toggle="collapse">
                                {t(subItem.label)}
                                {subItem.badgeName ? (
                                  <span className={'badge badge-pill bg-' + subItem.badgeColor} data-key="t-new">
                                    {subItem.badgeName}
                                  </span>
                                ) : null}
                              </Link>
                              <Collapse className="menu-dropdown" isOpen={subItem.stateVariables} id="sidebarEcommerce">
                                <ul className="nav nav-sm flex-column">
                                  {/* child subItms  */}
                                  {subItem.childItems &&
                                    (subItem.childItems || []).map((childItem, key) => (
                                      <React.Fragment key={key}>
                                        {!childItem.childItems ? (
                                          <li className="nav-item">
                                            <Link
                                              href={childItem.link ? childItem.link : '/#'}
                                              className="nav-link"
                                              onClick={e => {
                                                if (!e.currentTarget.href.endsWith(pathName))
                                                  dispatch(
                                                    changePageLoader(preloaderTypes.ENABLE) as unknown as AnyAction,
                                                  );
                                              }}
                                            >
                                              {t(childItem.label)}
                                            </Link>
                                          </li>
                                        ) : (
                                          <li className="nav-item">
                                            <Link
                                              href="/#"
                                              className="nav-link"
                                              onClick={childItem.click}
                                              data-bs-toggle="collapse"
                                            >
                                              {t(childItem.label)}
                                            </Link>
                                            <Collapse
                                              className="menu-dropdown"
                                              isOpen={childItem.stateVariables}
                                              id="sidebaremailTemplates"
                                            >
                                              <ul className="nav nav-sm flex-column">
                                                {childItem.childItems.map((subChildItem, key) => (
                                                  <li className="nav-item" key={key}>
                                                    <Link
                                                      href={subChildItem.link}
                                                      className="nav-link"
                                                      data-key="t-basic-action"
                                                      onClick={e => {
                                                        if (!e.currentTarget.href.endsWith(pathName))
                                                          dispatch(
                                                            changePageLoader(
                                                              preloaderTypes.ENABLE,
                                                            ) as unknown as AnyAction,
                                                          );
                                                      }}
                                                    >
                                                      {t(subChildItem.label)}
                                                    </Link>
                                                  </li>
                                                ))}
                                              </ul>
                                            </Collapse>
                                          </li>
                                        )}
                                      </React.Fragment>
                                    ))}
                                </ul>
                              </Collapse>
                            </li>
                          )}
                        </React.Fragment>
                      ))}
                  </ul>
                </Collapse>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  className="nav-link menu-link"
                  href={item.link ? item.link : '/#'}
                  onClick={e => {
                    if (!e.currentTarget.href.endsWith(pathName))
                      dispatch(changePageLoader(preloaderTypes.ENABLE) as unknown as AnyAction);
                  }}
                >
                  <i className={item.icon}></i> <span>{t(item.label)}</span>
                  {item.badgeName ? (
                    <span className={'badge badge-pill bg-' + item.badgeColor} data-key="t-new">
                      {item.badgeName}
                    </span>
                  ) : null}
                </Link>
              </li>
            )}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};

export default VerticalLayout;
