import { PostRequest } from '../../client/client';
import { RESET_PASSWORD_FP_URL } from './constants';

const resetPasswordFp = async (data: object) =>
  PostRequest(RESET_PASSWORD_FP_URL, data);

export default resetPasswordFp;
