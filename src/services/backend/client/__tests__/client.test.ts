import axios from 'axios';
import { GetRequest, PostRequest } from '../client';
import { getValidAccessToken } from '@services/auth';

jest.mock('axios', () => {
  const mockGet = jest.fn();
  const mockPost = jest.fn();
  const mockInstance = {
    get: mockGet,
    post: mockPost,
  };
  return {
    create: jest.fn(() => mockInstance),
  };
});

jest.mock('@services/auth', () => ({
  getValidAccessToken: jest.fn(),
}));

describe('Backend client requests', () => {
  let mockInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockInstance = (axios.create as jest.Mock)();
  });

  describe('GetRequest', () => {
    it('sends an authenticated GET request and returns data', async () => {
      (getValidAccessToken as jest.Mock).mockReturnValue('mock-token-123');
      mockInstance.get.mockResolvedValue({ data: { success: true } });

      const data = await GetRequest('/some-endpoint');

      expect(getValidAccessToken).toHaveBeenCalled();
      expect(mockInstance.get).toHaveBeenCalledWith('/some-endpoint', {
        headers: {
          Authorization: 'Bearer mock-token-123',
        },
      });
      expect(data).toEqual({ success: true });
    });
  });

  describe('PostRequest', () => {
    it('sends an authenticated POST request with payload and returns data', async () => {
      (getValidAccessToken as jest.Mock).mockReturnValue('mock-token-456');
      mockInstance.post.mockResolvedValue({ data: { id: 'created-id' } });

      const payload = { title: 'Test Post' };
      const data = await PostRequest('/create-endpoint', payload);

      expect(getValidAccessToken).toHaveBeenCalled();
      expect(mockInstance.post).toHaveBeenCalledWith(
        '/create-endpoint',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Authorization: 'Bearer mock-token-456',
          },
        },
      );
      expect(data).toEqual({ id: 'created-id' });
    });
  });
});
