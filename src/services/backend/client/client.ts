import axios from 'axios';
import { GROWBOARD_BACKEND_URL } from '../requests/constants';
import { getValidAccessToken } from '@services/auth';

const instance = axios.create({
  baseURL: GROWBOARD_BACKEND_URL,
  // withCredentials: true,
});

/**
 * Performs an authenticated GET request to the Growboard backend.
 * @param url - The endpoint URL (relative to the base URL).
 * @returns The response data from the server.
 */
export const GetRequest = async (url: string) => {
  const response = await instance.get(url, {
    headers: {
      Authorization: `Bearer ${getValidAccessToken()}`,
    },
  });
  return response.data;
};

/**
 * Performs an authenticated POST request to the Growboard backend.
 * @param url - The endpoint URL (relative to the base URL).
 * @param data - The request body payload.
 * @returns The response data from the server.
 */
export const PostRequest = async (url: string, data: unknown) => {
  const response = await instance.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${getValidAccessToken()}`,
    },
  });
  return response.data;
};

