import { ExpenseType } from '../types';

/**
 * Generates and prints a PDF of the current month's expenses.
 * Uses a hidden iframe and browser window.print() to support fonts and the rupee symbol out-of-the-box.
 */
export const downloadPDF = (
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

  // Brand color mapping matching the UI Theme but optimized for light backgrounds
  const EXPENSE_TYPE_COLOR: Record<ExpenseType, string> = {
    [ExpenseType.Food]: '#059669', // emerald-600
    [ExpenseType.Rent]: '#4f46e5', // indigo-600
    [ExpenseType.Travel]: '#0284c7', // sky-600
    [ExpenseType.Shopping]: '#db2777', // pink-600
    [ExpenseType.Studies]: '#7c3aed', // purple-600
    [ExpenseType.Snack]: '#d97706', // amber-600
    [ExpenseType.Extras]: '#dc2626', // red-600
    [ExpenseType.Family]: '#0d9488', // teal-600
    [ExpenseType.Misc]: '#4b5563', // slate-600
  };

  // Generate statistics cards HTML
  const totalSpendFormatted = `₹${totalSum.toLocaleString('en-IN')}`;
  const dailyAverageFormatted = `₹${stats.dailyAverage.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

  // Generate Category Breakdown Bar Chart HTML
  const sortedCategories = Object.entries(sumByCategory)
    .filter(([_, amt]) => amt > 0)
    .sort((a, b) => b[1] - a[1]);

  let categoryBarsHtml = '';
  if (sortedCategories.length > 0) {
    sortedCategories.forEach(([cat, amt]) => {
      const percentage = totalSum > 0 ? (amt / totalSum) * 100 : 0;
      const color = EXPENSE_TYPE_COLOR[cat as ExpenseType] || '#bac8d7';
      categoryBarsHtml += `
        <div class="bar-wrapper">
          <div class="bar-label-group">
            <span class="bar-name">${cat}</span>
            <span class="bar-value">₹${amt.toLocaleString('en-IN')} (${percentage.toFixed(1)}%)</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${percentage}%; background-color: ${color};"></div>
          </div>
        </div>
      `;
    });
  } else {
    categoryBarsHtml = `<div style="font-size: 11px; color: #8a9ba8; text-align: center; margin-top: 15px; font-style: italic;">No expense data logged</div>`;
  }

  // Generate table rows HTML
  let tableRowsHtml = '';
  dataToShow.forEach((row) => {
    let cellsHtml = `<td class="date-col">${row.date}</td>`;
    categories.forEach((cat) => {
      const catExpenses = row.data.filter((d: any) => d.category === cat);
      if (catExpenses.length > 0) {
        const sum = catExpenses.reduce(
          (acc: number, curr: any) => acc + curr.amount,
          0,
        );
        const color = EXPENSE_TYPE_COLOR[cat as ExpenseType] || '#1f2937';
        cellsHtml += `<td class="amount-cell" style="color: ${color};">₹${sum.toLocaleString('en-IN')}</td>`;
      } else {
        cellsHtml += `<td class="empty-cell">—</td>`;
      }
    });
    cellsHtml += `<td class="day-total-col">${row.sum > 0 ? `₹${row.sum.toLocaleString('en-IN')}` : '—'}</td>`;
    tableRowsHtml += `<tr>${cellsHtml}</tr>`;
  });

  // Footer Row
  let footerCellsHtml = '<td class="date-col">Total</td>';
  categories.forEach((cat) => {
    const total = sumByCategory[cat] ?? 0;
    const color = EXPENSE_TYPE_COLOR[cat as ExpenseType] || '#1f2937';
    footerCellsHtml += `<td style="color: ${total > 0 ? color : '#9ca3af'}; font-weight: 700;">${total > 0 ? `₹${total.toLocaleString('en-IN')}` : '₹0'}</td>`;
  });
  footerCellsHtml += `<td class="day-total-col">₹${totalSum.toLocaleString('en-IN')}</td>`;
  const footerRowHtml = `<tr class="total-row">${footerCellsHtml}</tr>`;

  // Main Report HTML template matching Obsidian Flux brand but light-optimized for print
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>GrowBoard Expenses Report - ${monthName} ${year}</title>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700&family=Hanken+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        @page {
          size: landscape;
          margin: 6mm 10mm;
        }

        @media print {
          body {
            background-color: #ffffff !important;
            color: #1f2937 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Geist', 'Hanken Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #ffffff;
          color: #1f2937;
          margin: 0;
          padding: 10px;
          line-height: 1.4;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }
        
        .brand-title {
          font-size: 22px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.5px;
        }
        
        .report-meta {
          text-align: right;
          font-size: 11px;
          color: #4b5563;
        }
        
        .summary-section {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
          width: 100%;
        }

        .stats-column {
          flex: 5;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        
        .stat-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 14px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .stat-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #4b5563;
          margin-bottom: 4px;
          font-weight: 600;
        }
        
        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
        }

        .highest-cat {
          font-size: 13px;
          color: #111827;
          font-weight: 700;
          margin-bottom: 1px;
        }

        .highest-amt {
          font-size: 10px;
          color: #4b5563;
        }

        .chart-column {
          flex: 4;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 14px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
        }

        .chart-title {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #4b5563;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .category-bars {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 120px;
          overflow: hidden;
        }

        .bar-wrapper {
          width: 100%;
        }

        .bar-label-group {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          margin-bottom: 3px;
        }

        .bar-name {
          font-weight: 600;
          color: #1f2937;
        }

        .bar-value {
          color: #4b5563;
        }

        .bar-track {
          width: 100%;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 3px;
        }
        
        .table-container {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          background: #ffffff;
          margin-top: 10px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          page-break-inside: auto;
        }
        
        tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }
        
        thead {
          display: table-header-group;
        }
        
        th, td {
          border: 1px solid #e5e7eb;
          padding: 7px 9px;
          text-align: center;
          font-size: 10px;
        }
        
        th {
          background: #1f2937;
          color: #ffffff;
          font-weight: 600;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        tr:nth-child(even) {
          background: #f9fafb;
        }
        
        .total-row {
          background: #f3f4f6;
          font-weight: 700;
          color: #111827;
        }
        
        .date-col {
          font-weight: 600;
          color: #4b5563;
        }
        
        .empty-cell {
          color: #9ca3af;
        }
        
        .amount-cell {
          font-weight: 600;
        }
        
        .day-total-col {
          font-weight: 700;
          color: #111827;
          background: #f9fafb;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand-title">GrowBoard Report</div>
          <div style="font-size: 11px; color: #8a9ba8; margin-top: 2px;">Monthly Expense Ledger</div>
        </div>
        <div class="report-meta">
          <div style="font-weight: 600; color: #ffffff;">${monthName} ${year}</div>
          <div style="margin-top: 2px;">Exported: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
        </div>
      </div>
      
      <div class="summary-section">
        <div class="stats-column">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Total Spend</div>
              <div class="stat-value" style="color: #818cf8;">${totalSpendFormatted}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Total Transactions</div>
              <div class="stat-value">${stats.totalTransactions}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Daily Average</div>
              <div class="stat-value">${dailyAverageFormatted}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Highest Category</div>
              <div class="stat-value">
                ${
                  stats.highestCategory
                    ? `
                  <div class="highest-cat">${stats.highestCategory.name}</div>
                  <div class="highest-amt">₹${stats.highestCategory.amount.toLocaleString('en-IN')}</div>
                `
                    : 'N/A'
                }
              </div>
            </div>
          </div>
        </div>
        
        <div class="chart-column">
          <div class="chart-title">Category Spending Breakdown (Chart)</div>
          <div class="category-bars">
            ${categoryBarsHtml}
          </div>
        </div>
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              ${categories.map((cat) => `<th>${cat}</th>`).join('')}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
            ${footerRowHtml}
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `;

  // Create an iframe to render the document
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    console.error('Failed to create iframe for PDF generation');
    return;
  }

  // Inject content
  doc.open();
  doc.write(htmlContent);
  doc.close();

  // Wait for resources (like web fonts) to resolve before launching print
  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    // Safely remove the iframe
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 500);
};
