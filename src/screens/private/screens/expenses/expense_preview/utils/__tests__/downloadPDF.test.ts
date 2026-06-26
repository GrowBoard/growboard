import { downloadPDF } from '../downloadPDF';
import { ExpenseType } from '../../types';

describe('downloadPDF', () => {
  beforeAll(() => {
    // mock window.print if it doesn't exist in JSDOM
    if (!window.print) {
      window.print = jest.fn();
    }
  });

  it('should generate and print PDF correctly', () => {
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
    ];

    const mockSumByCategory = {
      [ExpenseType.Food]: 500,
    } as any;

    const mockStats = {
      totalTransactions: 1,
      highestCategory: { name: 'Food', amount: 500 },
      dailyAverage: 500,
    };

    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');

    downloadPDF(
      mockDataToShow,
      mockSumByCategory,
      500,
      'June',
      2026,
      mockStats,
    );

    expect(appendChildSpy).toHaveBeenCalled();

    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });
});
