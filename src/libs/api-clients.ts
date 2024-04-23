import axios, { AxiosResponse } from 'axios';
import { Utils } from '@helpers/utils';

const defaultOptions = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
};

export const APIClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});

export const APIAuthClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/${process.env.NEXT_PUBLIC_API_PREFIX}`,
  headers: { 'Content-Type': 'application/json' },
});
// URL params replacer
APIAuthClient.interceptors.request.use(config => {
  if (!config.url) {
    return config;
  }

  const { pathname, search } = new URL(config.url, config.baseURL);
  let newPathname = pathname;
  let newSearch = search;
  /// parse pathName to implement variables
  // example: url 'http://example.com/:uuid' and body {...,urlParams:{uuid:'123456789'}}
  // return url 'http://example.com/123456789'
  if (config['urlParams'] || (config.data && config.data['urlParams'])) {
    Object.entries(config['urlParams'] || config.data['urlParams'] || {}).forEach(([k, v]) => {
      newPathname = newPathname.replace(`:${k}`, encodeURIComponent(v as string));
      newSearch = search.replace(`:${k}`, encodeURIComponent(v as string));
    });
    config = Utils.withoutProperty(config, 'urlParams');
    config.data = Utils.withoutProperty(config.data || {}, 'urlParams');
  }
  newPathname = newPathname + newSearch;

  return {
    ...config,
    url: newPathname,
  };
});

export interface IApiAPPClient {
  select<R>(url, params): any;
  create<D>(url, params): Promise<any>;
  search<R>(url, params): Promise<R>;
  update<D>(url, params): Promise<any>;
  delete(url, params): any;
}
class ApiAPPClient implements IApiAPPClient {
  /**
   * Fetches data from given url
   */
  select = <R>(url, params?) => {
    let response;
    let paramKeys: Array<string> = [];
    if (params) {
      Object.keys(Utils.withoutProperty(params, 'urlParams')).map(key => {
        if (params[key] != undefined) {
          if (key === 'sort') {
            paramKeys.push(
              `${key}=${Utils.convertArrayOfKeyAndValuesToString(Utils.objToArrayOfKeyAndValue(params[key]))}`,
            );
          } else paramKeys.push(`${key}=${params[key]}`);
          return paramKeys;
        }
      });
      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : '';
      response = APIAuthClient.get<any, AxiosResponse<R, any>, any>(
        `${url}${url.includes('?') ? '&' : '?'}${queryString}`,
        params,
      );
    } else {
      response = APIAuthClient.get<any, AxiosResponse<R, any>, any>(`${url}`, params);
    }
    return response;
  };
  /**
   * post given data to url
   */
  create = <D>(url, data, config?) => {
    return APIAuthClient.post<any, any, D>(url, data, config);
  };

  search = <R>(url, data?) => {
    if (data && data['sort']) {
      return APIAuthClient.post<any, R, any>(
        url,
        { ...data, sort: Utils.convertArrayOfKeyAndValuesToString(Utils.objToArrayOfKeyAndValue(data.sort)) } || {},
      );
    }
    return APIAuthClient.post<any, R, any>(url, data || {});
  };

  /**
   * Updates data
   */
  update = <D>(url, data) => {
    return APIAuthClient.put<any, any, D>(url, data);
  };

  /**
   * Delete
   */
  delete = (url, params?) => {
    let response;
    let paramKeys: Array<string> = [];
    if (params) {
      Object.keys(Utils.withoutProperty(params, 'urlParams')).map(key => {
        if (params[key] != undefined) {
          if (key === 'sort') {
            paramKeys.push(
              `${key}=${Utils.convertArrayOfKeyAndValuesToString(Utils.objToArrayOfKeyAndValue(params[key]))}`,
            );
          } else paramKeys.push(`${key}=${params[key]}`);
          return paramKeys;
        }
      });
      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : '';
      response = APIAuthClient.delete(`${url}${url.includes('?') ? '&' : '?'}${queryString}`, params);
    } else {
      response = APIAuthClient.delete(`${url}`, params);
    }
    return response;
  };
}
export const ApiAPPClientInstance = new ApiAPPClient();
