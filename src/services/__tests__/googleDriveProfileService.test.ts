import { googleDriveProfileService } from '../googleDriveProfileService';
import { appStore } from '@store';

describe('GoogleDriveProfileService', () => {
  let mockFetch: jest.Mock;
  let getOrCreateGrowboardFolderSpy: jest.SpyInstance;
  let getOrCreateProfileFileSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    appStore.setState({
      Auth: {
        ...appStore.getState().Auth,
        token: 'mock-token',
      },
    });

    getOrCreateGrowboardFolderSpy = jest
      .spyOn(googleDriveProfileService as any, 'getOrCreateGrowboardFolder')
      .mockResolvedValue('growboard-folder-id');
    getOrCreateProfileFileSpy = jest
      .spyOn(googleDriveProfileService as any, 'getOrCreateProfileFile')
      .mockResolvedValue('profile-file-id');
  });

  afterEach(() => {
    getOrCreateGrowboardFolderSpy.mockRestore();
    getOrCreateProfileFileSpy.mockRestore();
  });

  describe('readProfile', () => {
    it('returns parsed profile details on success', async () => {
      const mockProfile = {
        bio: 'Hello bio',
        phone_number: ['999'],
        socialLink: {
          facebook: 'fb',
          instagram: 'ig',
          github: 'gh',
          x: 'x',
          website: 'web',
        },
        hobbies: ['swimming'],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockProfile,
      });

      const response = await googleDriveProfileService.readProfile();
      expect(response).toEqual(mockProfile);
    });

    it('returns default fallback fields on partially empty response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      const response = await googleDriveProfileService.readProfile();
      expect(response.bio).toBe('');
      expect(response.phone_number).toEqual([]);
      expect(response.socialLink.facebook).toBe('');
    });
  });

  describe('saveProfile', () => {
    it('overwrites profile details successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      const profileInput = {
        bio: 'Updated bio',
        phone_number: ['123'],
        socialLink: {
          facebook: '',
          instagram: '',
          github: '',
          x: '',
          website: '',
        },
        hobbies: [],
      };

      await expect(
        googleDriveProfileService.saveProfile(profileInput),
      ).resolves.not.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch.mock.calls[0][1].method).toBe('PATCH');
    });
  });
});
