import { PostRequest } from '../../client/client';
import { FORGOT_PASSWORD_URL } from './constants';

const forgotPassword = async (data: object) =>
  PostRequest(FORGOT_PASSWORD_URL, data);

export default forgotPassword;
