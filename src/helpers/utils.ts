import moment from 'moment';
import _ from 'lodash';

import { CustomerOrderStatus, ShipmentStatus, OrderOperationTypes, FileSizeType } from './constants';
import MIMETypes from './mime-types';
import usFlag from '@assets/img/flags/us.svg';
import egFlag from '@assets/img/flags/eg.svg';
import jpFlag from '@assets/img/flags/jp.svg';
/**
 * Returns the given `obj` without the `property`.
 *
 * @param {Object} obj
 * @param {String} property
 *
 * @returns {Object}
 */
const withoutProperty = (obj, property) => {
  if (Object.keys(obj).find(k => k === property)) {
    const { [property]: unused, ...rest } = obj;
    return rest;
  } else return obj;
};

const removeObjectKeys = <T extends Record<string, any>>(obj: T, keysToRemove: string[]): T => {
  const newObj = {} as T;

  for (const key in obj) {
    if (!keysToRemove.includes(key)) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
};

const loadJSON = (path: string) => {
  return fetch(`${path}.json`, { headers: { 'Cache-Control': 'no-cache' } }).then(res => res.json());
};

const objToArrayOfKeyAndValue = (obj?: any): Array<any> | undefined => {
  if (!obj) return undefined;
  const results: Array<any> = [];
  Object.keys(obj).map(key => {
    results.push({ [key]: obj[key] });
  });
  return results;
};

const convertArrayOfKeyAndValuesToString = (items?: Array<any>, separator: string = ';'): string | undefined => {
  if (!items || items.length <= 0) return undefined;
  const keyValueStrings = items.map(item => {
    const objKey = Object.keys(item)[0];
    return `${objKey}:${item[objKey]}`;
  });
  return keyValueStrings.join(separator);
};
const findKeyByValue = (obj: any, value: any) =>
  (Object.keys(obj) as (keyof typeof obj)[]).find(key => {
    return !Array.isArray(obj[key]) ? obj[key] === value : !!obj[key].includes(value);
  });

const ascendingSortedData = (items: Array<any>, sortField) =>
  items.slice().sort((a, b) => a[sortField].localeCompare(b[sortField]));

// Sort in descending order by name
const descendingSortedData = (items: Array<any>, sortField) =>
  items.slice().sort((a, b) => b[sortField].localeCompare(a[sortField]));

const getObjFirstKey = (obj?: Object) => Object.keys(obj as object)[0] || '';

const getType = (p: any): string => {
  if (Array.isArray(p)) return 'array';
  else if (typeof p == 'string') return 'string';
  else if (p != null && typeof p == 'object') return 'object';
  else return 'other';
};

const getFileExtension = (fileName: string) => {
  const regex = /\.\w{3,4}($|\?)/;
  const matchResult = fileName.match(regex);
  return matchResult?.[0] || null;
};

const getFileIcon = (
  fileNameOrContentType: string | '.file' | '',
): { icon: string; type: 'FOLDER' | 'FILE' | 'DOCUMENT' | 'IMG' | 'VIDEO' | 'AUDIO' } => {
  const keyword = fileNameOrContentType.toLocaleLowerCase();
  const ext = getFileExtension(keyword)?.toLocaleLowerCase() || '';

  switch (true) {
    case ext === '' && keyword === '':
      return { icon: 'ri-folder-2-fill text-warning', type: 'FOLDER' };
    case ext === '.file':
      return { icon: 'ri-file-fill text-primary', type: 'FILE' };
    case MIMETypes.documents.word.some(x => `.${x.name}` === ext || x.template === keyword):
      return { icon: 'ri-file-text-fill text-secondary', type: 'DOCUMENT' };
    case MIMETypes.documents.text.some(x => `.${x.name}` === ext || x.template === keyword):
      return { icon: 'ri-file-text-fill text-primary', type: 'DOCUMENT' };
    case MIMETypes.documents.pdf.some(x => `.${x.name}` === ext || x.template === keyword):
      return { icon: 'ri-file-pdf-fill text-danger', type: 'DOCUMENT' };
    case MIMETypes.documents.excel.some(x => `.${x.name}` === ext || x.template === keyword):
      return { icon: 'ri-file-excel-fill text-success', type: 'DOCUMENT' };
    case MIMETypes.media.image.some(x => `.${x.name}` === ext || x.template === keyword):
      return { icon: 'ri-gallery-fill text-success', type: 'IMG' };
    case MIMETypes.media.video.some(x => `.${x.name}` === ext || x.template === keyword):
      return { icon: 'ri-film-fill text-warning', type: 'VIDEO' };
    case MIMETypes.media.audio.some(x => `.${x.name}` === ext || x.template === keyword):
      return { icon: 'ri-volume-up-fill text-secondary', type: 'AUDIO' };
    default:
      return { icon: 'ri-folder-2-fill text-warning', type: 'FOLDER' };
  }
};

const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return { value: 0, sizeType: FileSizeType.B };

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return { value: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), sizeType: FileSizeType[sizes[i]] };
};

const toPascalCase = (input: string): string => {
  if (input) {
    // Replace hyphens and underscores with spaces
    const stringWithSpaces = input.replace(/[-_]/g, ' ');

    // Split the string into words
    const words = stringWithSpaces.split(' ');

    // Capitalize the first letter of each word and join them
    const pascalCaseString = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return pascalCaseString;
  }
  return input;
};

const generateCode = (length, charsOnly = false, digitsOnly = false) => {
  let result = '';
  const characters = charsOnly
    ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    : digitsOnly
    ? '0123456789'
    : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const getFlagByLangCode = (code: string) => {
  switch (code) {
    case 'en-US':
      return usFlag;
    case 'ar-EG':
      return egFlag;
    case 'ja-JP':
      return jpFlag;
  }
};

/**
 * Remove all specified keys from an object, no matter how deep they are.
 * The removal is done in place, so run it on a copy if you don't want to modify the original object.
 * This function has no limit so circular objects will probably crash the browser
 *
 * @param obj The object from where you want to remove the keys
 * @param keys An array of property names (strings) to remove
 */
const removeKeysDeep = (obj, keys) => {
  var index;
  for (var prop in obj) {
    // important check that this is objects own property
    // not from prototype prop inherited
    if (obj.hasOwnProperty(prop)) {
      switch (typeof obj[prop]) {
        case 'object':
          index = keys.indexOf(prop);
          if (index > -1) {
            delete obj[prop];
          } else {
            removeKeysDeep(obj[prop], keys);
          }
          break;
        default:
          keys.forEach(k => {
            if (k === prop) delete obj[prop];
          });
          break;
      }
    }
  }
};

const orderStatusColor = (status: CustomerOrderStatus) => {
  switch (status) {
    case CustomerOrderStatus.New:
      return 'light';
    case CustomerOrderStatus.Processing:
      return 'primary';
    case CustomerOrderStatus.Completed:
      return 'success';
    case CustomerOrderStatus.NotPayed:
      return 'warning';
    case CustomerOrderStatus.Rejected:
    case CustomerOrderStatus.Cancelled:
      return 'danger';
    case CustomerOrderStatus.ReadyToSend:
      return 'dark';
    case CustomerOrderStatus.Prepared:
    case CustomerOrderStatus.PartiallySent:
      return 'secondary';
    case CustomerOrderStatus.Pending:
    case CustomerOrderStatus.Shipping:
    case CustomerOrderStatus.Paid:
      return 'info';
    default:
      return 'light';
  }
};

const orderOperationTypesIcon = (status: OrderOperationTypes | CustomerOrderStatus) => {
  switch (status) {
    case OrderOperationTypes.PaymentIn:
      return 'ri-wallet-3-line';
    case OrderOperationTypes.Shipment:
      return 'ri-truck-line';
    case OrderOperationTypes.CustomerOrder:
      return 'ri-shopping-bag-line';
    case OrderOperationTypes.Refund:
      return 'ri-refund-line';
    case OrderOperationTypes.Capture:
      return 'mdi mdi-gift-outline';
    case CustomerOrderStatus.Completed:
      return 'mdi mdi-package-variant';
    default:
      return 'ri-shopping-bag-line';
  }
};

const shipmentStatusColor = (status: ShipmentStatus) => {
  switch (status) {
    case ShipmentStatus.New:
      return 'primary';
    case ShipmentStatus.PickPack:
      return 'info';
    case ShipmentStatus.ReadyToSend:
      return 'warning';
    case ShipmentStatus.Sent:
      return 'success';
    case ShipmentStatus.Cancelled:
      return 'danger';
    default:
      return 'primary';
  }
};

const enumKeyByValue = (enumObj, val: string): string => {
  const indexOfS = Object.values(enumObj).indexOf(val as unknown as typeof enumObj);

  const key = Object.keys(enumObj)[indexOfS];

  return key;
};

const decodeJWT = (token: string) => JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

const formatDate = (date?: string, fromNow?: true, time?: '12' | '24', format?: string): string => {
  if (!isNaN(new Date(date || '').getTime())) {
    let newDate = '';
    if (format) newDate = moment(date).format(format);
    else if (fromNow) newDate = moment(date).fromNow(true);
    else if (time) {
      switch (time) {
        case '12':
          newDate = moment(date).format('DD MMM YYYY h:mm A');
          break;
        default:
          newDate = moment(date).format('DD MMM YYYY HH:mm:ss');
          break;
      }
    } else newDate = new Date(date!).toLocaleDateString('en-EG');
    return newDate;
  }
  return date || '';
};

const numberWithCommas = (val?: number) => {
  return (val || 0).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};

const formatCash = n => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K';
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M';
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B';
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T';
};

function getTodayDateRanges(format: string = 'YYYY-MM-DD'): {
  today: { start: string; end: string };
  lastWeek: { start: string; end: string };
  thisWeek: { start: string; end: string };
  thisMonth: { start: string; end: string };
  thisYear: { start: string; end: string };
} {
  const today = moment().format(format);
  const thisWeekStart = moment().startOf('isoWeek').format(format);
  const thisWeekEnd = moment().endOf('isoWeek').format(format);
  const thisMonthStart = moment().startOf('month').format(format);
  const thisMonthEnd = moment().endOf('month').format(format);
  const thisYearStart = moment().startOf('year').format(format);
  const thisYearEnd = moment().endOf('year').format(format);
  const lastWeek = moment().subtract(6, 'days').startOf('day').format(format);

  return {
    today: { start: today, end: today },
    lastWeek: { start: lastWeek, end: today },
    thisWeek: { start: thisWeekStart, end: thisWeekEnd },
    thisMonth: { start: thisMonthStart, end: thisMonthEnd },
    thisYear: { start: thisYearStart, end: thisYearEnd },
  };
}

const extractNavDataProp = (arr: any[], prop: string): string[] => {
  return _.flatMap(arr, item => {
    const links: string[] = [];
    if (item[prop]) {
      links.push(item[prop]);
    }
    if (item.subItems) {
      links.push(...extractNavDataProp(item.subItems, prop));
    }
    if (item.childItems) {
      links.push(...extractNavDataProp(item.childItems, prop));
    }
    return links;
  });
};

// Type guard to check if an item is an object
interface ObjectItem {
  [key: string]: any;
}
function isObject(item: any): item is ObjectItem {
  return typeof item === 'object' && item !== null && !Array.isArray(item);
}

function isSubsetOfArray(
  array1: (string | number | ObjectItem | any[])[],
  array2: (string | number | ObjectItem | any[])[],
): boolean {
  return array1.some(item1 => {
    return array2.some(item2 => {
      if (isObject(item1) && isObject(item2)) {
        return _.isEqual(item1, _.pick(item2, _.keys(item1)));
      } else if (Array.isArray(item1) && Array.isArray(item2)) {
        return _.isEqual(item1, item2);
      } else {
        return item1 === item2;
      }
    });
  });
}

const unifyBy = <T>(array: Array<{ name: string; data: Array<T> }>, comparablePropName: string,defaultValue:T,sort?:(data:Array<T>)=>Array<T>):Array<{ name: string; data:Array<T>}> => {
  const uniqueValuesArray = _.uniqBy(array.flatMap((item) => item.data.map((obj) => ({...defaultValue,[comparablePropName]:obj[comparablePropName]}))),_.property(comparablePropName));

  const result = array.map(obj => {
    const unionObjData = _.unionWith( obj.data,uniqueValuesArray, (a: T, b: T): boolean => a[comparablePropName] === b[comparablePropName])
    return {...obj,data:sort?sort(unionObjData):unionObjData};
  })

  return result;
};

const getMonthNumberFromName=(monthName:string):number=> {
  const year = new Date().getFullYear();
  return new Date(`${monthName} 1, ${year}`).getMonth() + 1;
}

export const Utils = {
  withoutProperty,
  loadJSON,
  objToArrayOfKeyAndValue,
  ascendingSortedData,
  descendingSortedData,
  getObjFirstKey,
  findKeyByValue,
  convertArrayOfKeyAndValuesToString,
  removeObjectKeys,
  getType,
  getFileExtension,
  getFileIcon,
  formatBytes,
  toPascalCase,
  generateCode,
  getFlagByLangCode,
  removeKeysDeep,
  orderStatusColor,
  enumKeyByValue,
  shipmentStatusColor,
  orderOperationTypesIcon,
  decodeJWT,
  formatDate,
  numberWithCommas,
  formatCash,
  getTodayDateRanges,
  extractNavDataProp,
  isSubsetOfArray,
  unifyBy,
  getMonthNumberFromName
};
