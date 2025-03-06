
import { ExpenseItem, IncomeItem } from "../types/finance";

// Local storage keys
const EXPENSES_KEY = 'money-mapper-expenses';
const INCOME_KEY = 'money-mapper-income';

// Helper function to group items by month
const getMonthKey = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
};

// Save expenses to local storage
export const saveExpenses = (expenses: ExpenseItem[]): void => {
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error('Error saving expenses to local storage:', error);
  }
};

// Load expenses from local storage
export const loadExpenses = (): ExpenseItem[] => {
  try {
    const storedExpenses = localStorage.getItem(EXPENSES_KEY);
    if (!storedExpenses) return [];
    
    return JSON.parse(storedExpenses).map((expense: any) => ({
      ...expense,
      date: new Date(expense.date)
    }));
  } catch (error) {
    console.error('Error loading expenses from local storage:', error);
    return [];
  }
};

// Save income to local storage
export const saveIncome = (income: IncomeItem[]): void => {
  try {
    localStorage.setItem(INCOME_KEY, JSON.stringify(income));
  } catch (error) {
    console.error('Error saving income to local storage:', error);
  }
};

// Load income from local storage
export const loadIncome = (): IncomeItem[] => {
  try {
    const storedIncome = localStorage.getItem(INCOME_KEY);
    if (!storedIncome) return [];
    
    return JSON.parse(storedIncome).map((income: any) => ({
      ...income,
      date: new Date(income.date)
    }));
  } catch (error) {
    console.error('Error loading income from local storage:', error);
    return [];
  }
};

// Get current month's expenses
export const getCurrentMonthExpenses = (): ExpenseItem[] => {
  const expenses = loadExpenses();
  const currentMonth = getMonthKey(new Date());
  
  return expenses.filter((expense) => 
    getMonthKey(expense.date) === currentMonth
  );
};

// Get current month's income
export const getCurrentMonthIncome = (): IncomeItem[] => {
  const income = loadIncome();
  const currentMonth = getMonthKey(new Date());
  
  return income.filter((income) => 
    getMonthKey(income.date) === currentMonth
  );
};

// Get previous month's expenses
export const getPreviousMonthExpenses = (): ExpenseItem[] => {
  const expenses = loadExpenses();
  const today = new Date();
  const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1);
  const previousMonthKey = getMonthKey(previousMonth);
  
  return expenses.filter((expense) => 
    getMonthKey(expense.date) === previousMonthKey
  );
};

// Get previous month's income
export const getPreviousMonthIncome = (): IncomeItem[] => {
  const income = loadIncome();
  const today = new Date();
  const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1);
  const previousMonthKey = getMonthKey(previousMonth);
  
  return income.filter((income) => 
    getMonthKey(income.date) === previousMonthKey
  );
};

// Export data as CSV
export const exportAsCSV = (expenses: ExpenseItem[], income: IncomeItem[]): string => {
  const expenseRows = expenses.map((expense) => ({
    type: 'Expense',
    date: expense.date.toISOString().split('T')[0],
    category: expense.category,
    description: expense.description,
    amount: expense.amount.toFixed(2),
  }));

  const incomeRows = income.map((income) => ({
    type: 'Income',
    date: income.date.toISOString().split('T')[0],
    category: income.category,
    description: income.description,
    amount: income.amount.toFixed(2),
  }));

  const allRows = [...expenseRows, ...incomeRows];
  
  // Sort by date
  allRows.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const headers = ['Type', 'Date', 'Category', 'Description', 'Amount'];
  const csvHeader = headers.join(',');
  const csvRows = allRows.map((row) => 
    `${row.type},${row.date},${row.category},"${row.description.replace(/"/g, '""')}",${row.amount}`
  );

  return [csvHeader, ...csvRows].join('\n');
};
