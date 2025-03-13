import { PostRequest } from '../../../client';
import { FIN_UPDATE_EXPENSE_URL } from './constants';

const updateExpenseData = async (data: object) =>
  PostRequest(FIN_UPDATE_EXPENSE_URL, data);

export default updateExpenseData;
