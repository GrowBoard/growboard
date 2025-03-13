import { GetRequest } from '../../../client/client';
import { USER_GET_USER_DATA_URL } from './constants';

const getUserData = async () => GetRequest(USER_GET_USER_DATA_URL);

export default getUserData;
