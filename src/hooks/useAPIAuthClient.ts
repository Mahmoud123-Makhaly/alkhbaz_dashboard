'use client';
import { APIAuthClient, ApiAPPClientInstance } from '@app/libs';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useToast, useTranslate } from '@app/hooks';

const useAPIAuthClient = () => {
  const { data: session } = useSession();
  const toast = useToast();
  const t = useTranslate('HOOK_ApiClient');

  useEffect(() => {
    const requestIntercept = APIAuthClient.interceptors.request.use(
      config => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${session?.user?.accessToken}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );
    // intercepting to capture errors
    const responseIntercept = APIAuthClient.interceptors.response.use(
      response => {
        return response && response.data ? response.data : response;
      },
      error => {
        if (error.message.includes('403')) window.location.href = '/403';
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        else {
          let message;
          switch (true) {
            case error.status >= 500:
              message = t('ERR_INTERNAL_SERVER');
              break;
            case error.status === 401:
              message = t('ERR_INVALID_CREDENTIALS');
              break;
            case error.status === 404:
              message = t('ERR_NOT_FOUNDED');
              break;
            case error.status >= 400:
              message = t('ERR_BAD_REQUEST');
              break;
            case error.status >= 300:
              message = t('ERR_BAD_REQUEST');
              break;
            default:
              message = error.message || error;
          }
          return Promise.reject(message);
        }
      },
    );

    return () => {
      APIAuthClient.interceptors.request.eject(requestIntercept);
      APIAuthClient.interceptors.response.eject(responseIntercept);
    };
  }, [session, t, toast]); //refreshToken

  return ApiAPPClientInstance;
};

export default useAPIAuthClient;
