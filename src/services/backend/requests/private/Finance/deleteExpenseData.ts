import { PostRequest } from '../../../client';
import { FIN_DELETE_EXPENSE_DATA_URL } from './constants';

const deleteExpenseData = async (data: object) =>
  PostRequest(FIN_DELETE_EXPENSE_DATA_URL, data);

export default deleteExpenseData;
