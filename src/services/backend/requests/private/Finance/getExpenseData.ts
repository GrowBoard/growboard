import { PostRequest } from '../../../client';
import { FIN_GET_EXPENSE_DATA_URL } from './constants';

const getExpenseData = async (data: object) =>
  PostRequest(FIN_GET_EXPENSE_DATA_URL, data);

export default getExpenseData;
