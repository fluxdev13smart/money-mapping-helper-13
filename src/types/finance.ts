
export type Category = 
  | 'Housing'
  | 'Transportation'
  | 'Food'
  | 'Utilities'
  | 'Healthcare'
  | 'Insurance'
  | 'Entertainment'
  | 'Shopping'
  | 'Personal'
  | 'Debt'
  | 'Savings'
  | 'Investments'
  | 'Education'
  | 'Gifts/Donations'
  | 'Travel'
  | 'Other';

export type IncomeCategory = 
  | 'Salary'
  | 'Freelance'
  | 'Business'
  | 'Investments'
  | 'Gifts'
  | 'Other';

export interface ExpenseItem {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: Date;
}

export interface IncomeItem {
  id: string;
  amount: number;
  category: IncomeCategory;
  description: string;
  date: Date;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  largestExpenseCategory: {
    category: Category;
    amount: number;
    percentage: number;
  };
  expensesByCategory: {
    category: Category;
    amount: number;
    percentage: number;
  }[];
  monthlyComparison?: {
    incomeChange: number;
    expenseChange: number;
  };
}
