import {
  googleDriveCredsService,
  encodeBase64,
  decodeBase64,
} from '../googleDriveCredsService';

jest.mock('@store', () => {
  const mockState = {
    Auth: {
      token: 'mock-token',
    },
  };
  const mockStore = Object.assign(
    jest.fn((selector: (state: typeof mockState) => unknown) => {
      return selector(mockState);
    }),
    {
      getState: jest.fn(() => mockState),
    },
  );
  return {
    appStore: mockStore,
  };
});

interface PrivateServiceExpose {
  getOrCreateGrowboardFolder(): Promise<string>;
  getOrCreateCredsFolder(parentId: string): Promise<string>;
  getOrCreateCredsFile(parentId: string): Promise<string>;
  cache: {
    growboardFolderId?: string;
    credsFolderId?: string;
    credsFileId?: string;
  };
}

const privateService =
  googleDriveCredsService as unknown as PrivateServiceExpose;

describe('googleDriveCredsService Base64 encoding/decoding helper', () => {
  it('correctly encodes and decodes text including unicode', () => {
    const original = 'Test string with unicode: 🚀 & €';
    const encoded = encodeBase64(original);
    const decoded = decodeBase64(encoded);
    expect(decoded).toBe(original);
  });
});

describe('GoogleDriveCredsService', () => {
  let mockFetch: jest.Mock;
  let spyFolder: jest.SpiedFunction<
    PrivateServiceExpose['getOrCreateGrowboardFolder']
  >;
  let spySubfolder: jest.SpiedFunction<
    PrivateServiceExpose['getOrCreateCredsFolder']
  >;
  let spyFile: jest.SpiedFunction<PrivateServiceExpose['getOrCreateCredsFile']>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    // Spy and mock private methods to prevent Drive folder creation API calls during file read/save tests
    spyFolder = jest
      .spyOn(privateService, 'getOrCreateGrowboardFolder')
      .mockResolvedValue('mock-growboard-folder-id');
    spySubfolder = jest
      .spyOn(privateService, 'getOrCreateCredsFolder')
      .mockResolvedValue('mock-creds-folder-id');
    spyFile = jest
      .spyOn(privateService, 'getOrCreateCredsFile')
      .mockResolvedValue('mock-creds-file-id');
  });

  describe('readCreds', () => {
    it('returns empty array when credentials file content is empty', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name: string) =>
            name === 'content-type' ? 'text/plain' : null,
        },
        text: async () => '',
      });

      const result = await googleDriveCredsService.readCreds();
      expect(result).toEqual([]);
    });

    it('decodes and parses credentials list from base64 representation', async () => {
      const mockData = [
        {
          credTitle: 'AWS Prod',
          credData: [
            { name: 'AccessKey', value: 'AKIA' },
            { name: 'SecretKey', value: 'secret' },
          ],
        },
      ];
      const base64Data = encodeBase64(JSON.stringify(mockData));

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name: string) =>
            name === 'content-type' ? 'text/plain' : null,
        },
        text: async () => base64Data,
      });

      const result = await googleDriveCredsService.readCreds();
      expect(result).toEqual(mockData);
    });

    it('returns empty array on parse errors', async () => {
      const invalidBase64 = encodeBase64('invalid-json');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name: string) =>
            name === 'content-type' ? 'text/plain' : null,
        },
        text: async () => invalidBase64,
      });

      const result = await googleDriveCredsService.readCreds();
      expect(result).toEqual([]);
    });
  });

  describe('saveCreds', () => {
    it('patches file with base64 encoded payload', async () => {
      const mockData = [
        {
          credTitle: 'GCP Staging',
          credData: [{ name: 'Token', value: 'gcp-val' }],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 'mock-creds-file-id' }),
      });

      await googleDriveCredsService.saveCreds(mockData);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toContain('mock-creds-file-id');
      expect(options.method).toBe('PATCH');
      expect(options.body).toBe(encodeBase64(JSON.stringify(mockData)));
    });
  });

  describe('getOrCreateCredsFolder and file creation', () => {
    it('resolves and creates directories if not present in cache', async () => {
      // Restore spies to test real implementation
      spyFolder.mockRestore();
      spySubfolder.mockRestore();
      spyFile.mockRestore();

      // Clear cache to force directory searches and creations
      privateService.cache = {};

      const mockData = [
        {
          credTitle: 'AWS Dev',
          credData: [{ name: 'Key', value: 'val' }],
        },
      ];

      // Mock fetch cascade:
      // 1. Search Growboard folder -> find folder
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ files: [{ id: 'found-growboard-folder' }] }),
      });
      // 2. Search Creds folder -> not found
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ files: [] }),
      });
      // 3. Create Creds folder -> success
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 'created-creds-folder' }),
      });
      // 4. Search cred file -> not found
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ files: [] }),
      });
      // 5. Create cred file -> success
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 'created-cred-file' }),
      });
      // 6. Patch cred file -> success
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 'created-cred-file' }),
      });

      await googleDriveCredsService.saveCreds(mockData);

      // Verify overall fetch count matching directory navigation
      expect(mockFetch).toHaveBeenCalledTimes(6);
      expect(privateService.cache.growboardFolderId).toBe(
        'found-growboard-folder',
      );
      expect(privateService.cache.credsFolderId).toBe('created-creds-folder');
      expect(privateService.cache.credsFileId).toBe('created-cred-file');
    });
  });
});
