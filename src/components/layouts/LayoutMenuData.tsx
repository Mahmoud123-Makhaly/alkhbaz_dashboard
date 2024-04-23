import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next-intl/client';
import { useSession } from 'next-auth/react';
import { SecurityUserRoles } from '@helpers/constants';

const NavData = () => {
  const { data: session } = useSession();
  const [dynamic, setDynamic] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  const [isCurrentState, setIsCurrentState] = useState({});

  const updateIconSidebar = e => {
    if (e && e.target && e.target.getAttribute('subitems')) {
      const ul = document.getElementById('two-column-menu');
      const iconItems = ul?.querySelectorAll('.nav-icon.active');
      let activeIconItems = iconItems;
      if (activeIconItems)
        activeIconItems.forEach(item => {
          item.classList.remove('active');
          var id = item.getAttribute('subitems') || '';
          if (document.getElementById(id)) document.getElementById(id)?.classList.remove('show');
        });
    }
  };

  const toggleMenu = (id: string, isSubItem: boolean = false) => {
    if (isSubItem)
      setIsCurrentState(prevState => ({
        ...prevState,
        [id]: !prevState[id],
      }));
    else
      setIsCurrentState(prevState => ({
        ...{},
        [id]: !prevState[id],
      }));
  };

  const isOpen = (id: string) => {
    return isCurrentState[id] || false;
  };

  const findMatchingIds = (menuItems, linkToFind: string): string[] => {
    const result: string[] = [];

    const search = (items, parentIds: string[]) => {
      for (const item of items) {
        const currentIds = [...parentIds, item.id];

        if (item.link === linkToFind) {
          result.push(...currentIds);
        }

        if (item.subItems) {
          search(item.subItems, currentIds);
        }
      }
    };

    search(menuItems, []);

    return result;
  };

  useEffect(() => {
    if (!isCurrentState || Object.keys(isCurrentState).length === 0) {
      const activeItems = findMatchingIds(renderMenu(), pathName);
      if (activeItems) {
        const initialState = activeItems.reduce(
          (obj, item) => {
            obj[item] = true;
            return obj;
          },
          {} as { [key: string]: boolean },
        );
        setIsCurrentState({
          ...{},
          ...initialState,
        });
      }
    }
  }, []);

  const TOTMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboards',
      icon: 'ri-dashboard-2-line',
      link: '/dashboard',
      allowedRoles: [
        SecurityUserRoles.Administrator,
        SecurityUserRoles.MarketingManager,
        SecurityUserRoles.CallCenterAgent,
        SecurityUserRoles.StoreManager,
      ],
      stateVariables: isOpen('dashboard'),
      click: function (e) {
        e.preventDefault();
        toggleMenu('dashboard');
        updateIconSidebar(e);
      },
    },
    {
      id: 'catalog',
      label: 'Catalog',
      icon: 'ri-book-2-line',
      link: '/#',
      allowedRoles: [SecurityUserRoles.Administrator],
      stateVariables: isOpen('catalog'),
      click: function (e) {
        e.preventDefault();
        toggleMenu('catalog');
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: 'catalogs',
          label: 'Catalogs',
          icon: 'ri-product-hunt-line',
          link: '/catalogs',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'catalog',
        },
        {
          id: 'categories',
          label: 'Categories',
          icon: 'ri-product-hunt-line',
          link: '/categories',
          allowedRoles: [
            SecurityUserRoles.Administrator,
            SecurityUserRoles.CallCenterAgent,
            SecurityUserRoles.StoreManager,
          ],
          parentId: 'catalog',
        },
        {
          id: 'products',
          label: 'Products',
          icon: 'ri-product-hunt-line',
          link: '/products',
          allowedRoles: [
            SecurityUserRoles.Administrator,
            SecurityUserRoles.CallCenterAgent,
            SecurityUserRoles.StoreManager,
          ],
          parentId: 'catalog',
        },
        {
          id: 'manufacturers',
          label: 'Manufacturers',
          icon: 'ri-product-hunt-line',
          link: '/manufacturers',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'catalog',
        },
        {
          id: 'product-reviews',
          label: 'Product Reviews',
          icon: 'ri-product-hunt-line',
          link: '/product-reviews',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'catalog',
        },
        {
          id: 'product-tags',
          label: 'Product Tags',
          icon: 'ri-product-hunt-line',
          link: '/product-tags',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'catalog',
        },
        {
          id: 'attributes',
          label: 'Attributes',
          icon: 'ri-product-hunt-line',
          link: '/attributes',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'catalog',
        },
      ],
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: 'ri-exchange-dollar-fill',
      link: '/#',
      allowedRoles: [SecurityUserRoles.Administrator, SecurityUserRoles.MarketingManager],
      stateVariables: isOpen('sales'),
      click: function (e) {
        e.preventDefault();
        toggleMenu('sales');
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: 'orders',
          label: 'Orders',
          icon: 'ri-product-hunt-line',
          link: '/orders',
          allowedRoles: [
            SecurityUserRoles.Administrator,
            SecurityUserRoles.MarketingManager,
            SecurityUserRoles.CallCenterAgent,
            SecurityUserRoles.StoreManager,
          ],
          parentId: 'sales',
        },
        {
          id: 'carts',
          label: 'Carts',
          icon: 'ri-product-hunt-line',
          link: '/carts',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'sales',
        },
        {
          id: 'shipments',
          label: 'Shipments',
          icon: 'ri-product-hunt-line',
          link: '/shipments',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'sales',
        },
        {
          id: 'return-requests',
          label: 'Return Requests',
          icon: 'ri-product-hunt-line',
          link: '/return-requests',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'sales',
        },
        {
          id: 'recurring-payments',
          label: 'Recurring Payments',
          icon: 'ri-product-hunt-line',
          link: '/recurring-payments',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'sales',
        },
        {
          id: 'gift-cards',
          label: 'Gift Cards',
          icon: 'ri-product-hunt-line',
          link: '/gift-cards',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'sales',
        },
        {
          id: 'wishlists',
          label: 'Wishlists',
          icon: 'ri-product-hunt-line',
          link: '/wishlists',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'sales',
        },
      ],
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: 'ri-user-line',
      link: '/#',
      allowedRoles: [SecurityUserRoles.Administrator],
      stateVariables: isOpen('customers'),
      click: function (e) {
        e.preventDefault();
        toggleMenu('customers');
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: 'customers',
          label: 'Customers',
          icon: 'ri-product-hunt-line',
          link: '/customers',
          allowedRoles: [
            SecurityUserRoles.Administrator,
            SecurityUserRoles.CallCenterAgent,
            SecurityUserRoles.StoreManager,
          ],
          parentId: 'customers',
        },
        {
          id: 'employees',
          label: 'Employees',
          icon: 'ri-product-hunt-line',
          link: '/employees',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'customers',
        },
        {
          id: 'organizations',
          label: 'Organizations',
          icon: 'ri-product-hunt-line',
          link: '/organizations',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'customers',
        },
        {
          id: 'vendors',
          label: 'Vendors',
          icon: 'ri-product-hunt-line',
          link: '/vendors',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'customers',
        },
        {
          id: 'activity-log',
          label: 'Activity Log',
          icon: 'ri-product-hunt-line',
          link: '/activity-log',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'customers',
        },
        {
          id: 'activity-types',
          label: 'Activity Types',
          icon: 'ri-product-hunt-line',
          link: '/activity-types',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'customers',
        },
        {
          id: 'gdpr',
          label: 'GDPR requests',
          icon: 'ri-product-hunt-line',
          link: '/gdpr',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'customers',
        },
      ],
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: 'ri-line-chart-line',
      link: '/#',
      allowedRoles: [SecurityUserRoles.Administrator],
      stateVariables: isOpen('marketing'),
      click: function (e) {
        e.preventDefault();
        toggleMenu('marketing');
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: 'promotions',
          label: 'Promotions',
          icon: 'ri-product-hunt-line',
          link: '/#',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'marketing',
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setDynamic(!dynamic);
          },
          stateVariables: dynamic,
          childItems: [
            {
              id: 1,
              label: 'Discounts',
              link: '/promotions',
              allowedRoles: [SecurityUserRoles.Administrator],
              parentId: 'marketing',
            },
            {
              id: 2,
              label: 'Coupons',
              link: '/coupons',
              allowedRoles: [SecurityUserRoles.Administrator],
              parentId: 'marketing',
            },
            {
              id: 3,
              label: 'Gifts',
              link: '/gifts',
              allowedRoles: [SecurityUserRoles.Administrator],
              parentId: 'marketing',
            },
            {
              id: 4,
              label: 'Loyalty',
              link: '/loyalty',
              allowedRoles: [SecurityUserRoles.Administrator],
              parentId: 'marketing',
            },
          ],
        },
        {
          id: 'dynamicProductAssociations',
          label: 'Dynamic Product Associations',
          icon: 'ri-product-hunt-line',
          link: '/dynamic-product',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'marketing',
        },
        {
          id: 'customerSegments',
          label: 'Customer Segments',
          icon: 'ri-product-hunt-line',
          link: '/customer-segments',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'marketing',
        },
      ],
    },
    {
      id: 'content-management',
      label: 'Content Management',
      icon: 'ri-product-hunt-line',
      link: '/#',
      allowedRoles: [SecurityUserRoles.Administrator],
      stateVariables: isOpen('content-management'),
      click: function (e) {
        e.preventDefault();
        toggleMenu('content-management');
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: 'content-items',
          label: 'Content Items',
          icon: 'ri-product-hunt-line',
          link: '/marketing-content-items',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'content-management',
        },
        {
          id: 'content-placeholders',
          label: 'Content Placeholders',
          icon: 'ri-product-hunt-line',
          link: '/content-placeholders',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'content-management',
        },
        {
          id: 'published-content',
          label: 'Published Content',
          icon: 'ri-product-hunt-line',
          link: '/published-content',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'content-management',
        },
      ],
    },
    {
      id: 'offers',
      label: 'Offers',
      icon: 'ri-honour-line',
      link: '/offers',
      allowedRoles: [SecurityUserRoles.Administrator],
      stateVariables: isOpen('offers'),
      click: function (e) {
        e.preventDefault();
        toggleMenu('offers');
        updateIconSidebar(e);
      },
    },
    {
      id: 'stores',
      label: 'Stores',
      icon: 'ri-store-3-line',
      link: '/#',
      allowedRoles: [SecurityUserRoles.Administrator],
      stateVariables: isOpen('stores'),
      click: function (e) {
        e.preventDefault();
        toggleMenu('stores');
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: 'warehouses',
          label: 'Warehouses',
          icon: 'ri-product-hunt-line',
          link: '/warehouses',
          allowedRoles: [SecurityUserRoles.Administrator, SecurityUserRoles.StoreManager],
          parentId: 'stores',
        },
        {
          id: 'inventory',
          label: 'Inventory',
          icon: 'ri-store-2-line',
          link: '/inventory',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'stores',
        },
      ],
    },
    {
      id: 'prices',
      label: 'Prices',
      icon: 'ri-money-dollar-circle-line',
      link: '/#',
      allowedRoles: [SecurityUserRoles.Administrator],
      stateVariables: isOpen('prices'),
      click: function (e) {
        e.preventDefault();
        toggleMenu('prices');
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: 'assignments',
          label: 'Price Assignments',
          icon: 'ri-product-hunt-line',
          link: '/prices-assignments',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'prices',
        },
        {
          id: 'pricesList',
          label: 'Price List',
          icon: 'ri-product-hunt-line',
          link: '/prices-list',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'prices',
        },
      ],
    },
    {
      id: 'assets',
      label: 'Assets',
      icon: 'ri-folder-open-line',
      link: '/assets',
      allowedRoles: [SecurityUserRoles.Administrator],
      stateVariables: isOpen('assets'),
      click: function (e) {
        e.preventDefault();
        toggleMenu('assets');
        updateIconSidebar(e);
      },
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: 'ri-bar-chart-2-line',
      link: '/#',
      allowedRoles: [SecurityUserRoles.Administrator],
      stateVariables: isOpen('reports'),
      click: function (e) {
        e.preventDefault();
        toggleMenu('reports');
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: 'sales',
          label: 'Sales',
          icon: 'ri-product-hunt-line',
          link: '/reports/sales',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'reports',
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setDynamic(!dynamic);
          },
          stateVariables: dynamic,
          childItems: [
            {
              id: 1,
              label: 'Discounts',
              link: '/reports/sales/discounts',
              allowedRoles: [SecurityUserRoles.Administrator],
              parentId: 'sales',
            },
            {
              id: 2,
              label: 'Taxes',
              link: '/reports/sales/taxes',
              allowedRoles: [SecurityUserRoles.Administrator],
              parentId: 'sales',
            },
            {
              id: 3,
              label: 'Shipments',
              link: '/reports/sales/shipments',
              allowedRoles: [SecurityUserRoles.Administrator],
              parentId: 'sales',
            },
          ],
        },
        {
          id: 'customers',
          label: 'Customers',
          icon: 'ri-store-2-line',
          link: '/reports/customers',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'reports',
        },
        {
          id: 'stores',
          label: 'Stores',
          icon: 'ri-switch-line',
          link: '/reports/stores',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'reports',
        },
        {
          id: 'products',
          label: 'Products',
          icon: 'ri-switch-line',
          link: '/reports/products',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'reports',
        },
        {
          id: 'orders',
          label: 'Orders',
          icon: 'ri-switch-line',
          link: '/reports/orders',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'reports',
        },
      ],
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'ri-git-repository-private-line',
      link: '/#',
      allowedRoles: [SecurityUserRoles.Administrator],
      stateVariables: isOpen('security'),
      click: function (e) {
        e.preventDefault();
        toggleMenu('security');
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: 'users',
          label: 'Users',
          icon: 'ri-product-hunt-line',
          link: '/users',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'security',
        },
        {
          id: 'roles',
          label: 'Roles',
          icon: 'ri-product-hunt-line',
          link: '/roles',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'security',
        },
      ],
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: 'ri-switch-line',
      link: '/integrations',
      allowedRoles: [SecurityUserRoles.Administrator],
      stateVariables: isOpen('integrations'),
      click: function (e) {
        e.preventDefault();
        toggleMenu('integrations');
        updateIconSidebar(e);
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'ri-settings-4-line',
      link: '/#',
      allowedRoles: [SecurityUserRoles.Administrator],
      stateVariables: isOpen('settings'),
      click: function (e) {
        e.preventDefault();
        toggleMenu('settings');
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: 'company',
          label: 'Company',
          icon: 'ri-product-hunt-line',
          link: '/company',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'settings',
        },
        {
          id: 'configurations',
          label: 'Configurations',
          icon: 'ri-store-2-line',
          link: '/configurations',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'settings',
        },
        {
          id: 'jobs',
          label: 'Jobs',
          icon: 'ri-switch-line',
          link: '/jobs',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'settings',
        },
        {
          id: 'templates',
          label: 'Templates',
          icon: 'ri-switch-line',
          link: '/templates',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'settings',
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: 'ri-switch-line',
          link: '/notifications',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'settings',
        },
        {
          id: 'lookups',
          label: 'Lookups tables',
          icon: 'ri-switch-line',
          link: '/lookups',
          allowedRoles: [SecurityUserRoles.Administrator],
          parentId: 'settings',
        },
      ],
    },
  ];

  const filterMenuItemsByRoles = (session, menuItems) => {
    function filterItems(items, userRoles) {
      return items.filter(item => {
        if (item.subItems) {
          item.subItems = filterItems(item.subItems, userRoles);
          return item.subItems.length > 0;
        }

        if (item.childItems) {
          item.childItems = filterItems(item.childItems, userRoles);
          return item.childItems.length > 0;
        }

        if (item.allowedRoles && item.allowedRoles.some(role => userRoles.includes(role))) {
          return true;
        }

        return false;
      });
    }

    if (!session || !session.user || !session.user.roles) {
      return [{ link: 'unauthorized' }];
    }

    const userRoles = Array.isArray(session.user.roles) ? session.user.roles : [session.user.roles];

    return filterItems(menuItems, userRoles);
  };

  const renderMenu = () => {
    return filterMenuItemsByRoles(session, TOTMenuItems) || null;
  };
  return <React.Fragment>{renderMenu() as ReactNode}</React.Fragment>;
};
export default NavData;
