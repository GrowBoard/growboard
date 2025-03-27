import { PostRequest } from '../../client/client';
import { VERIFY_URL } from './constants';

const verifyUser = async (data: object) => PostRequest(VERIFY_URL, data);

export default verifyUser;
