import {
  GetRequest as GetClient,
  PostRequest as PostClient,
} from '../../../client';
import { GetRequest as GetClientFile } from '../../../client/client';
import addExpenseData from '../Finance/addExpenseData';
import deleteExpenseData from '../Finance/deleteExpenseData';
import getExpenseData from '../Finance/getExpenseData';
import updateExpenseData from '../Finance/updateExpenseData';
import getUserData from '../User/getUserData';
import updateUserData from '../User/updateUserData';
import updateUserSocialData from '../User/updateUserSocialData';
import authCheckTest from '../others/authCheckTest';

jest.mock('../../../client', () => ({
  GetRequest: jest.fn(),
  PostRequest: jest.fn(),
}));

jest.mock('../../../client/client', () => ({
  GetRequest: jest.fn(),
  PostRequest: jest.fn(),
}));

describe('Private Requests service helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('addExpenseData calls PostRequest', async () => {
    (PostClient as jest.Mock).mockResolvedValue('add-response');
    const data = { amount: 100 };
    const res = await addExpenseData(data);
    expect(PostClient).toHaveBeenCalledWith(expect.any(String), data);
    expect(res).toBe('add-response');
  });

  it('deleteExpenseData calls PostRequest', async () => {
    (PostClient as jest.Mock).mockResolvedValue('delete-response');
    const data = { id: 'exp-1' };
    const res = await deleteExpenseData(data);
    expect(PostClient).toHaveBeenCalledWith(expect.any(String), data);
    expect(res).toBe('delete-response');
  });

  it('getExpenseData calls PostRequest', async () => {
    (PostClient as jest.Mock).mockResolvedValue('get-response');
    const data = { month: 'June' };
    const res = await getExpenseData(data);
    expect(PostClient).toHaveBeenCalledWith(expect.any(String), data);
    expect(res).toBe('get-response');
  });

  it('updateExpenseData calls PostRequest', async () => {
    (PostClient as jest.Mock).mockResolvedValue('update-response');
    const data = { id: 'exp-1', amount: 150 };
    const res = await updateExpenseData(data);
    expect(PostClient).toHaveBeenCalledWith(expect.any(String), data);
    expect(res).toBe('update-response');
  });

  it('getUserData calls GetRequest', async () => {
    (GetClientFile as jest.Mock).mockResolvedValue('user-data');
    const res = await getUserData();
    expect(GetClientFile).toHaveBeenCalledWith(expect.any(String));
    expect(res).toBe('user-data');
  });

  it('updateUserData calls PostRequest', async () => {
    (PostClient as jest.Mock).mockResolvedValue('user-update');
    const data = { name: 'Amit' };
    const res = await updateUserData(data);
    expect(PostClient).toHaveBeenCalledWith(expect.any(String), data);
    expect(res).toBe('user-update');
  });

  it('updateUserSocialData calls PostRequest', async () => {
    (PostClient as jest.Mock).mockResolvedValue('social-update');
    const data = { twitter: '@amit' };
    const res = await updateUserSocialData(data);
    expect(PostClient).toHaveBeenCalledWith(expect.any(String), data);
    expect(res).toBe('social-update');
  });

  it('authCheckTest calls GetRequest', async () => {
    (GetClient as jest.Mock).mockResolvedValue({ status: 'ok' });
    const res = await authCheckTest();
    expect(GetClient).toHaveBeenCalledWith(expect.any(String));
    expect(res).toEqual({ status: 'ok' });
  });
});
