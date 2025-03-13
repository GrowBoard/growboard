import { GetRequest } from '../../client/client';
import { PING_URL } from './constants';

const pingTest = async () => GetRequest(PING_URL);

export default pingTest;
