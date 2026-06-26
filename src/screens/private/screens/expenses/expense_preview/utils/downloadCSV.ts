import { ExpenseType } from '../types';

/**
 * Downloads the current month's expenses as a CSV file.
 * The layout matches the Expenses Register table format, with summary statistics at the top.
 */
export const downloadCSV = (
  dataToShow: any[],
  sumByCategory: Record<string, number>,
  totalSum: number,
  monthName: string,
  year: number,
  stats: {
    totalTransactions: number;
    highestCategory: { name: string; amount: number; color?: string } | null;
    dailyAverage: number;
  },
) => {
  const categories = Object.values(ExpenseType);
  const rows: string[][] = [];

  // Report Title & Metadata at the top (single-cell rows to allow overflow without stretching columns)
  rows.push([`GrowBoard Expense Report - ${monthName} ${year}`]);
  rows.push([`Generated On: ${new Date().toLocaleDateString()}`]);
  rows.push([
    `Summary Statistics: Total Spend = INR ${totalSum.toFixed(2)} | Transactions = ${stats.totalTransactions} | Daily Avg = INR ${stats.dailyAverage.toFixed(2)} | Highest Category = ${stats.highestCategory ? `${stats.highestCategory.name} (INR ${stats.highestCategory.amount.toFixed(2)})` : 'N/A'}`,
  ]);
  rows.push([]);

  // Table Headers
  const headers = ['Date', ...categories, 'Day Total'];
  rows.push(headers);

  // Table Data Rows
  dataToShow.forEach((row) => {
    const rowValues: string[] = [row.date];
    categories.forEach((cat) => {
      const catExpenses = row.data.filter((d: any) => d.category === cat);
      if (catExpenses.length > 0) {
        const sum = catExpenses.reduce(
          (acc: number, curr: any) => acc + curr.amount,
          0,
        );
        rowValues.push(sum.toFixed(2));
      } else {
        rowValues.push(''); // Empty for clean presentation
      }
    });
    rowValues.push(row.sum > 0 ? row.sum.toFixed(2) : '');
    rows.push(rowValues);
  });

  // Table Footer Row (Totals)
  const footerRow: string[] = ['Category Total'];
  categories.forEach((cat) => {
    const total = sumByCategory[cat] ?? 0;
    footerRow.push(total > 0 ? total.toFixed(2) : '0.00');
  });
  footerRow.push(totalSum.toFixed(2));
  rows.push(footerRow);

  // Escape special characters and convert to CSV format
  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          const escaped = String(cell).replace(/"/g, '""');
          return escaped.includes(',') ||
            escaped.includes('\n') ||
            escaped.includes('"')
            ? `"${escaped}"`
            : escaped;
        })
        .join(','),
    )
    .join('\n');

  // Trigger browser download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `growboard-expenses-${monthName.toLowerCase()}-${year}.csv`,
  );
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
