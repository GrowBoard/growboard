import { GetRequest } from '../../../client';
import { AUTH_CHECK_URL } from './constants';

const authCheckTest = async () => GetRequest(AUTH_CHECK_URL);

export default authCheckTest;
