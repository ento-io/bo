import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { getServerUrl } from '@/utils/utils';

// =================
// ? The issue: why use a factory instead of a static instance?
// getServerUrl think that window.LOCAL is undefined because this file get executed
// before the index.tsx file which initialize all the glogal variables
// ? It is maybe an issue with Linux
// so we need someone to test this with windows (or mac)
// =================

// ======
// the axios instance factory function
// ======
const createInstance = () =>
  axios.create({
    baseURL: getServerUrl(),
  });

/**
 * set api bearer token header
 * @param {boolean} hasFile
 * @param {string} sessionToken // session token of the current user
 * @returns
 */
export const protectRequest = (sessionToken: string, hasFile = false): AxiosRequestConfig => {
  return {
    headers: {
      'X-ento-key': import.meta.env.VITE_REST_API_KEY ?? '',
      'X-Parse-Session-Token': sessionToken,
      'Content-Type': hasFile ? 'multipart/form-data' : 'application/json',
    },
  };
};

// get the data field response directly
const responseBody = <O>(response: AxiosResponse<O>) => response.data;

export const http = {
  get: <O>(url: string, config?: AxiosRequestConfig): Promise<O> =>
    createInstance().get<O>(url, config).then(responseBody),
  post: <I, O>(url: string, body: I, config?: AxiosRequestConfig): Promise<O> =>
    createInstance().post<O>(url, body, config).then(responseBody),
  put: <I, O>(url: string, body: I, config?: AxiosRequestConfig): Promise<O> =>
    createInstance().put<O>(url, body, config).then(responseBody),
  delete: <O>(url: string, config?: AxiosRequestConfig): Promise<O> =>
    createInstance().delete<O>(url, config).then(responseBody),
};
