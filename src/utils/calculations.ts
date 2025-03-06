
import { Category, ExpenseItem, FinancialSummary, IncomeItem } from "../types/finance";

export function calculateFinancialSummary(
  expenses: ExpenseItem[],
  income: IncomeItem[],
  previousMonthExpenses?: ExpenseItem[],
  previousMonthIncome?: IncomeItem[]
): FinancialSummary {
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  // Group expenses by category
  const expensesByCategory: Record<Category, number> = {} as Record<Category, number>;
  
  expenses.forEach((expense) => {
    if (!expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] = 0;
    }
    expensesByCategory[expense.category] += expense.amount;
  });

  // Create the expensesByCategory array for the summary
  const expensesByCategoryArray = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      category: category as Category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    })
  ).sort((a, b) => b.amount - a.amount);

  // Find the largest expense category
  const largestExpenseCategory = expensesByCategoryArray.length > 0 
    ? expensesByCategoryArray[0] 
    : { category: 'Other' as Category, amount: 0, percentage: 0 };

  // Calculate month-over-month changes if previous data exists
  const monthlyComparison = previousMonthExpenses && previousMonthIncome
    ? {
        incomeChange: calculatePercentageChange(
          income.reduce((sum, item) => sum + item.amount, 0),
          previousMonthIncome.reduce((sum, item) => sum + item.amount, 0)
        ),
        expenseChange: calculatePercentageChange(
          expenses.reduce((sum, item) => sum + item.amount, 0),
          previousMonthExpenses.reduce((sum, item) => sum + item.amount, 0)
        ),
      }
    : undefined;

  return {
    totalIncome,
    totalExpenses,
    balance,
    savingsRate,
    largestExpenseCategory,
    expensesByCategory: expensesByCategoryArray,
    monthlyComparison,
  };
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(percentage: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(percentage / 100);
}

export function getCategoryColor(category: Category): string {
  const colorMap: Record<Category, string> = {
    Housing: '#4f46e5',
    Transportation: '#0891b2',
    Food: '#16a34a',
    Utilities: '#0284c7',
    Healthcare: '#9333ea',
    Insurance: '#0369a1',
    Entertainment: '#c026d3',
    Shopping: '#d946ef',
    Personal: '#db2777',
    Debt: '#dc2626',
    Savings: '#2563eb',
    Investments: '#059669',
    Education: '#ea580c',
    'Gifts/Donations': '#65a30d',
    Travel: '#0d9488',
    Other: '#64748b',
  };

  return colorMap[category] || '#64748b';
}

export function getIncomeColor(category: string): string {
  const colorMap: Record<string, string> = {
    Salary: '#059669',
    Freelance: '#0d9488',
    Business: '#0891b2',
    Investments: '#2563eb',
    Gifts: '#8b5cf6',
    Other: '#64748b',
  };

  return colorMap[category] || '#059669';
}
