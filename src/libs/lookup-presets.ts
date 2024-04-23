import { ICustomerItem, ILookupItem } from '@app/types';
import { endpoints } from '@app/libs';
import { Timezones } from '@helpers/timezones';

const catalogLookup: ILookupItem = {
  name: 'catalogs',
  endpoint: endpoints.catalogs.list,
  listResultPropName: 'results',
  valuePropName: 'id',
  labelPropName: 'name',
  method: 'search',
  payload: {
    sort: {
      name: 'asc',
    },
    skip: 0,
    take: 1000,
  },
};
const warehousesOuterIdLookup: ILookupItem = {
  name: 'warehouseOuterId',
  endpoint: endpoints.warehouses.list,
  listResultPropName: 'results',
  valuePropName: 'outerId',
  labelPropName: 'outerId',
  method: 'search',
  payload: {
    sort: {
      name: 'asc',
    },
    skip: 0,
    take: 1000,
  },
};
const warehousesLookup: ILookupItem = {
  name: 'warehouses',
  endpoint: endpoints.warehouses.list,
  listResultPropName: 'results',
  valuePropName: 'id',
  labelPropName: 'name',
  method: 'search',
  payload: {
    sort: {
      name: 'asc',
    },
    skip: 0,
    take: 1000,
  },
};
const employeesOuterIdLookup: ILookupItem = {
  name: 'employeesOuterId',
  endpoint: endpoints.employees.list,
  listResultPropName: 'results',
  valuePropName: 'outerId',
  labelPropName: 'outerId',
  method: 'search',
  payload: {
    sort: {
      name: 'asc',
    },
    skip: 0,
    take: 1000,
    memberType: 'Employee',
  },
};
const customerSegmentsObjectIdLookup: ILookupItem = {
  name: 'customerSegmentsObjectId',
  endpoint: endpoints.customerSegment.list,
  listResultPropName: 'results',
  valuePropName: 'id',
  labelPropName: 'name',
  method: 'search',
  payload: {
    sort: {
      name: 'asc',
    },
    skip: 0,
    take: 1000,
  },
};
const categoriesLookup: ILookupItem = {
  name: 'categories',
  endpoint: endpoints.categories.list,
  listResultPropName: 'items',
  valuePropName: 'id',
  labelPropName: 'name',
  method: 'search',
  payload: {
    sort: {
      name: 'asc',
    },
    skip: 0,
    take: 1000,
  },
};

const contentPlaceLookup: ILookupItem = {
  name: 'contentPlaces',
  endpoint: endpoints.contentPlaceholders.list,
  listResultPropName: 'results',
  valuePropName: 'id',
  labelPropName: 'name',
  method: 'search',
  payload: {
    sort: {
      name: 'asc',
    },
    skip: 0,
    take: 1000,
  },
};
const companiesLookup: ILookupItem = {
  name: 'companies',
  endpoint: endpoints.organizations.list,
  listResultPropName: 'results',
  valuePropName: 'id',
  labelPropName: 'name',
  method: 'search',
  payload: {
    skip: 0,
    take: 1000,
  },
};
const priceListLookup: ILookupItem = {
  name: 'priceList',
  endpoint: endpoints.pricesList.list,
  listResultPropName: 'results',
  valuePropName: 'id',
  labelPropName: 'name',
  method: 'select',
  payload: {
    sort: {
      name: 'asc',
    },
    skip: 0,
    take: 1000,
  },
};

const contentItemsLookup: ILookupItem = {
  name: 'contentItems',
  endpoint: endpoints.contentItems.list,
  listResultPropName: 'results',
  valuePropName: 'id',
  labelPropName: 'name',
  method: 'search',
  payload: {
    sort: {
      name: 'asc',
    },
    skip: 0,
    take: 1000,
  },
};
const currencyLookup: ILookupItem = {
  name: 'currency',
  endpoint: endpoints.currency.list,
  valuePropName: 'code',
  labelPropName: 'name',
  method: 'select',
};
const permissionsLookup: ILookupItem = {
  name: 'permissions',
  endpoint: endpoints.permissions.list,
  valuePropName: 'id',
  labelPropName: 'name',
  method: 'select',
};
const languagesLookup: ILookupItem = {
  name: 'languages',
  endpoint: endpoints.languages.list,
  method: 'select',
};
const countriesLookup: ILookupItem = {
  name: 'countries',
  endpoint: endpoints.countries.list,
  valuePropName: 'name',
  labelPropName: 'name',
  method: 'select',
};
const storesLookup: ILookupItem = {
  name: 'stores',
  endpoint: endpoints.stores.list,
  listResultPropName: 'results',
  valuePropName: 'id',
  labelPropName: 'name',
  method: 'search',
  payload: {
    sort: {
      name: 'asc',
    },
    skip: 0,
    take: 1000,
  },
};
const rolesLookup: ILookupItem = {
  name: 'roles',
  endpoint: endpoints.roles.list,
  listResultPropName: 'results',
  valuePropName: 'id',
  labelPropName: 'name',
  method: 'search',
  payload: {
    sort: {
      name: 'asc',
    },
    skip: 0,
    take: 1000,
  },
};

const accountStatusesLookup: ILookupItem = {
  name: 'accountStatuses',
  endpoint: endpoints.status.accountStatuses,
  method: 'select',
};

const employeeStatuses: ILookupItem = {
  name: 'employeeStatuses',
  endpoint: endpoints.status.employeeStatuses,
  listResultPropName: 'allowedValues',
  method: 'select',
};
const contactStatuses: ILookupItem = {
  name: 'contactStatuses',
  endpoint: endpoints.status.contactStatuses,
  listResultPropName: 'allowedValues',
  method: 'select',
};
const imageCategories: ILookupItem = {
  name: 'imageCategories',
  endpoint: endpoints.status.imageCategories,
  method: 'select',
};
const orderStatuses: ILookupItem = {
  name: 'orderStatuses',
  endpoint: endpoints.status.orderStatuses,
  method: 'select',
};
const accountTypes: ILookupItem = {
  name: 'accountTypes',
  endpoint: endpoints.AccountTypes.list,
  listResultPropName: 'allowedValues',
  method: 'select',
};
const productTax: ILookupItem = {
  name: 'productTax',
  endpoint: endpoints.tax.taxType,
  method: 'select',
};
const taxType: ILookupItem = {
  name: 'taxType',
  endpoint: endpoints.tax.taxType,
  method: 'select',
};
const priceAssignmentLookup: ILookupItem = {
  name: 'priceAssignment',
  endpoint: endpoints.assignments.list,
  listResultPropName: 'results',
  valuePropName: 'id',
  labelPropName: 'name',
  method: 'select',
  payload: {
    sort: {
      name: 'asc',
    },
    skip: 0,
    take: 1000,
  },
};
const orderLookup: ILookupItem = {
  name: 'orders',
  endpoint: endpoints.orders.list,
  listResultPropName: 'results',
  valuePropName: 'id',
  labelPropName: 'number',
  method: 'search',
  payload: {
    sort: {
      name: 'asc',
    },
    skip: 0,
    take: 1000,
  },
};
const organizationLookup: ILookupItem = {
  name: 'organizations',
  endpoint: endpoints.organizations.list,
  listResultPropName: 'results',
  valuePropName: 'id',
  labelPropName: 'name',
  method: 'search',
  payload: {
    sort: {
      name: 'asc',
    },
    skip: 0,
    take: 1000,
  },
};
const customerSecurityLookup: ILookupItem<ICustomerItem> = {
  name: 'customerSecurityLookup',
  endpoint: endpoints.customers.list,
  listResultPropName: 'results',
  labelPropName: 'name',
  method: 'search',
  payload: {
    sort: {
      name: 'asc',
    },
    deepSearch: true,
    skip: 0,
    take: 1000,
  },
  valueResolver: item => {
    if (item.securityAccounts) {
      return item.securityAccounts.map(x => x.id).join(',');
    }
    return item.id!;
  },
};

const customerOuterIdLookup: ILookupItem = {
  name: 'customersOuterId',
  endpoint: endpoints.customers.list,
  listResultPropName: 'results',
  valuePropName: 'outerId',
  labelPropName: 'outerId',
  method: 'search',
  payload: {
    sort: {
      name: 'asc',
    },
    skip: 0,
    take: 1000,
  },
};
const employeeLookup: ILookupItem = {
  name: 'employee',
  endpoint: endpoints.employees.list,
  listResultPropName: 'results',
  valuePropName: 'id',
  labelPropName: 'name',
  method: 'search',
  payload: {
    sort: {
      name: 'asc',
    },
    skip: 0,
    take: 1000,
    memberType: 'Employee',
  },
};
const timezones = Timezones;

const orderSource = [
  { label: 'Web', value: 'Web' },
  { label: 'Mobile', value: 'Mobile' },
  { label: 'CallCenter', value: 'CallCenter' },
  { label: 'Talabat', value: 'Talabat' },
  { label: 'Menus', value: 'Menus' },
  { label: 'POS', value: 'POS' },
  { label: 'BackOrder', value: 'BackOrder' },
  { label: 'FB', value: 'Facebook' },
];

const packageTypes: ILookupItem = {
  name: 'packageTypes',
  endpoint: endpoints.packageTypes.list,
  method: 'select',
};

const weightUnits: ILookupItem = {
  name: 'weightUnits',
  endpoint: endpoints.weightUnits.list,
  method: 'select',
};

const measureUnits: ILookupItem = {
  name: 'measureUnits',
  endpoint: endpoints.measureUnits.list,
  method: 'select',
};

const editorialReviewTypes: ILookupItem = {
  name: 'editorialReviewTypes',
  endpoint: endpoints.editorialReviewTypes.list,
  method: 'select',
};

const shipmentStatuses: ILookupItem = {
  name: 'shipmentStatuses',
  endpoint: endpoints.status.shipmentStatuses,
  method: 'select',
};

const addressType = [
  { label: 'Billing', value: 'Billing' },
  { label: 'Shipping', value: 'Shipping' },
  { label: 'BillingAndShipping', value: 'BillingAndShipping' },
];

const customerOrderDynamicProperties: ILookupItem = {
  name: 'customerOrderDynamicProperties',
  endpoint: endpoints.dynamicProperties.list,
  listResultPropName: 'results',
  valuePropName: 'id',
  labelPropName: 'name',
  method: 'search',
  payload: {
    objectType: 'TotPlatform.OrdersModule.Core.Model.CustomerOrder',
  },
};

const vendorsLookup: ILookupItem = {
  name: 'vendors',
  endpoint: endpoints.vendors.list,
  listResultPropName: 'results',
  valuePropName: 'id',
  labelPropName: 'name',
  method: 'search',
  payload: {
    memberType: 'Vendor',
    skip: 0,
    take: 1000,
    responseGroup: 'none',
  },
};

export {
  catalogLookup,
  categoriesLookup,
  contentPlaceLookup,
  contentItemsLookup,
  storesLookup,
  priceListLookup,
  currencyLookup,
  permissionsLookup,
  rolesLookup,
  accountStatusesLookup,
  employeeStatuses,
  contactStatuses,
  languagesLookup,
  accountTypes,
  priceAssignmentLookup,
  companiesLookup,
  productTax,
  taxType,
  timezones,
  orderSource,
  orderLookup,
  organizationLookup,
  customerSecurityLookup,
  employeeLookup,
  orderStatuses,
  warehousesOuterIdLookup,
  employeesOuterIdLookup,
  customerOuterIdLookup,
  customerSegmentsObjectIdLookup,
  countriesLookup,
  warehousesLookup,
  packageTypes,
  weightUnits,
  measureUnits,
  editorialReviewTypes,
  imageCategories,
  shipmentStatuses,
  addressType,
  customerOrderDynamicProperties,
  vendorsLookup,
};
