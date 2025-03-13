import { PostRequest } from '../../client/client';
import { REGISTER_URL } from './constants';

const registerUser = async (data: object) => PostRequest(REGISTER_URL, data);

export default registerUser;
