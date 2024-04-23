'use client';

import { useCallback } from 'react';
import { ILookup, ILookupResult, ILookupItem, ISearchResponse, ILookupOption } from '@app/types';
import { useAPIAuthClient } from '@app/hooks';
const useLookup = (props: ILookup) => {
  const apiClient = useAPIAuthClient();

  const search = useCallback(
    (endpoint, listResultPropName, valuePropName, labelPropName, payload, name, valueResolver) =>
      new Promise<ILookupResult | null>((resolve, reject) =>
        apiClient
          .search<ISearchResponse<any>>(endpoint, payload)
          .then(
            data => {
              const response = listResultPropName ? data[listResultPropName] : data;
              if (response && Array.isArray(response)) {
                const result: Array<ILookupOption> = response.map((item: { [x: string]: any }) => {
                  return {
                    value: valueResolver
                      ? valueResolver(item)
                      : valuePropName
                      ? (item[valuePropName] || '').toString()
                      : (item || '').toString(),
                    label: labelPropName ? (item[labelPropName] || '').toString() : (item || '').toString(),
                    meta: item,
                  };
                });
                resolve({ [name]: result.filter(x => x.label != '' && x.value != '') });
              } else resolve({ [name]: [] });
            },
            err => {
              reject({ [name]: err });
            },
          )
          .catch(reason => reject({ [name]: reason })),
      ),
    [apiClient],
  );

  const select = useCallback(
    (endpoint, listResultPropName, valuePropName, labelPropName, payload, name, valueResolver) =>
      new Promise<ILookupResult | null>((resolve, reject) =>
        apiClient
          .select<ISearchResponse<any>>(endpoint, payload)
          .then(
            data => {
              const response = listResultPropName ? data[listResultPropName] : data;
              if (response && Array.isArray(response)) {
                const result: Array<ILookupOption> = response.map((item: { [x: string]: any }) => {
                  return {
                    value: valueResolver
                      ? valueResolver(item)
                      : valuePropName
                      ? (item[valuePropName] || '').toString()
                      : (item || '').toString(),
                    label: labelPropName ? (item[labelPropName] || '').toString() : (item || '').toString(),
                    meta: item,
                  };
                });
                resolve({ [name]: result.filter(x => x.label != '' && x.value != '') });
              } else resolve({ [name]: [] });
            },
            err => {
              reject({ [name]: err });
            },
          )
          .catch(reason => reject({ [name]: reason })),
      ),
    [apiClient],
  );

  const load = useCallback(async () => {
    const promises: Array<Promise<ILookupResult | null>> = [];
    props.map((item: ILookupItem) => {
      const { endpoint, listResultPropName, valuePropName, labelPropName, payload, name, valueResolver } = item;
      switch (item.method) {
        case 'search':
          return promises.push(
            search(endpoint, listResultPropName, valuePropName, labelPropName, payload, name, valueResolver),
          );
        case 'select':
          return promises.push(
            select(endpoint, listResultPropName, valuePropName, labelPropName, payload, name, valueResolver),
          );
      }
    });
    return Promise.all(promises).then(
      data => Promise.resolve(Object.assign({}, ...data)),
      data => Promise.reject(Object.assign({}, ...data)),
    );
  }, [props, search, select]);

  return { load };
};
export default useLookup;
