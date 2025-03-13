import { PostRequest } from '../../client/client';
import { LOGIN_URL } from './constants';

const loginUser = async (data: object) => PostRequest(LOGIN_URL, data);

export default loginUser;
