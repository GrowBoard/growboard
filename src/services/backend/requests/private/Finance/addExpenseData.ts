import { PostRequest } from '../../../client';
import { FIN_ADD_EXPENSE_URL } from './constants';

const addExpenseData = async (data: object) =>
  PostRequest(FIN_ADD_EXPENSE_URL, data);

export default addExpenseData;
