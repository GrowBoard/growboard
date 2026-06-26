import { downloadCSV } from '../downloadCSV';
import { ExpenseType } from '../../types';

describe('downloadCSV', () => {
  let originalCreateObjectURL: any;
  let originalRevokeObjectURL: any;

  beforeAll(() => {
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = jest.fn(() => 'mock-url');
    URL.revokeObjectURL = jest.fn();
  });

  afterAll(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  it('should compile and download CSV correctly', () => {
    const mockDataToShow = [
      {
        date: '2026-06-01',
        data: [
          {
            id: '1',
            amount: 500,
            date_time: '2026-06-01',
            comment: 'Lunch',
            category: ExpenseType.Food,
          },
        ],
        sum: 500,
      },
      {
        date: '2026-06-02',
        data: [],
        sum: 0,
      },
    ];

    const mockSumByCategory = {
      [ExpenseType.Food]: 500,
    } as any;

    const mockStats = {
      totalTransactions: 1,
      highestCategory: { name: 'Food', amount: 500 },
      dailyAverage: 250,
    };

    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');

    downloadCSV(
      mockDataToShow,
      mockSumByCategory,
      500,
      'June',
      2026,
      mockStats,
    );

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();

    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });
});
