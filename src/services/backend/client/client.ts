import axios from 'axios';
import { GROWBOARD_BACKEND_URL } from '../requests/constants';

const instance = axios.create({
  baseURL: GROWBOARD_BACKEND_URL,
});

export const GetRequest = async (url: string) => {
  try {
    const response = await instance.get(url);
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

export const PostRequest = async (url: string, data: unknown) => {
  const response = await instance.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
  return response.data;
};
