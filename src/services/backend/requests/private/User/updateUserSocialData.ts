import { PostRequest } from '../../../client';
import { USER_UPDATE_USER_SOCIAL_DATA_URL } from './constants';

const getArticlesData = async (data: object) =>
  PostRequest(USER_UPDATE_USER_SOCIAL_DATA_URL, data);

export default getArticlesData;
