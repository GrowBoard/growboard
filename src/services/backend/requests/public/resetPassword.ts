import { PostRequest } from '../../client/client';
import { RESET_PASSWORD_URL } from './constants';

const resetPassword = async (data: object) =>
  PostRequest(RESET_PASSWORD_URL, data);

export default resetPassword;
