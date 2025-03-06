
import React, { useEffect, useState } from "react";
import { FinancialSummary, ExpenseItem, IncomeItem } from "@/types/finance";
import { calculateFinancialSummary, formatCurrency, formatPercentage } from "@/utils/calculations";
import { 
  getCurrentMonthExpenses, 
  getCurrentMonthIncome, 
  getPreviousMonthExpenses, 
  getPreviousMonthIncome, 
  loadExpenses, 
  loadIncome, 
  saveExpenses, 
  saveIncome 
} from "@/utils/storage";
import IncomeForm from "./IncomeForm";
import ExpenseForm from "./ExpenseForm";
import Charts from "./Charts";
import ExportOptions from "./ExportOptions";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, DollarSign, Percent, PiggyBank, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [income, setIncome] = useState<IncomeItem[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Load data from local storage on initial load
  useEffect(() => {
    const loadedExpenses = loadExpenses();
    const loadedIncome = loadIncome();
    
    setExpenses(loadedExpenses);
    setIncome(loadedIncome);
  }, []);

  // Update summary when expenses or income change
  useEffect(() => {
    const currentMonthExpenses = getCurrentMonthExpenses();
    const currentMonthIncome = getCurrentMonthIncome();
    const previousMonthExpenses = getPreviousMonthExpenses();
    const previousMonthIncome = getPreviousMonthIncome();
    
    const calculatedSummary = calculateFinancialSummary(
      currentMonthExpenses,
      currentMonthIncome,
      previousMonthExpenses,
      previousMonthIncome
    );
    
    setSummary(calculatedSummary);
  }, [expenses, income]);

  const handleAddExpense = (expense: ExpenseItem) => {
    const updatedExpenses = [...expenses, expense];
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  const handleAddIncome = (newIncome: IncomeItem) => {
    const updatedIncome = [...income, newIncome];
    setIncome(updatedIncome);
    saveIncome(updatedIncome);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track, analyze, and understand your finances
          </p>
        </motion.div>
        
        {summary && (
          <ExportOptions expenses={expenses} income={income} summary={summary} />
        )}
      </div>
      
      {summary ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Income
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-finance-income" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(summary.totalIncome)}
                  </div>
                  {summary.monthlyComparison && (
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      {summary.monthlyComparison.incomeChange > 0 ? (
                        <>
                          <ArrowUp className="h-3 w-3 mr-1 text-finance-income" />
                          <span className="text-finance-income">
                            {Math.abs(summary.monthlyComparison.incomeChange).toFixed(1)}%
                          </span>
                        </>
                      ) : summary.monthlyComparison.incomeChange < 0 ? (
                        <>
                          <ArrowDown className="h-3 w-3 mr-1 text-finance-expense" />
                          <span className="text-finance-expense">
                            {Math.abs(summary.monthlyComparison.incomeChange).toFixed(1)}%
                          </span>
                        </>
                      ) : (
                        <span>No change</span>
                      )}
                      <span className="ml-1">from last month</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Expenses
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-finance-expense" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(summary.totalExpenses)}
                  </div>
                  {summary.monthlyComparison && (
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      {summary.monthlyComparison.expenseChange > 0 ? (
                        <>
                          <ArrowUp className="h-3 w-3 mr-1 text-finance-expense" />
                          <span className="text-finance-expense">
                            {Math.abs(summary.monthlyComparison.expenseChange).toFixed(1)}%
                          </span>
                        </>
                      ) : summary.monthlyComparison.expenseChange < 0 ? (
                        <>
                          <ArrowDown className="h-3 w-3 mr-1 text-finance-income" />
                          <span className="text-finance-income">
                            {Math.abs(summary.monthlyComparison.expenseChange).toFixed(1)}%
                          </span>
                        </>
                      ) : (
                        <span>No change</span>
                      )}
                      <span className="ml-1">from last month</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Current Balance
                  </CardTitle>
                  <PiggyBank className="h-4 w-4 text-finance-saving" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(summary.balance)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {summary.balance >= 0 
                      ? "You're staying within budget" 
                      : "You're spending more than you earn"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Savings Rate
                  </CardTitle>
                  <Percent className="h-4 w-4 text-finance-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPercentage(summary.savingsRate)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {summary.savingsRate >= 20
                      ? "Excellent saving habits!"
                      : summary.savingsRate >= 10
                      ? "Good saving progress"
                      : summary.savingsRate >= 0
                      ? "Consider increasing savings"
                      : "You're in deficit this month"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 rounded-lg">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Charts expenses={expenses} income={income} />
            </TabsContent>
            
            <TabsContent value="income" className="space-y-6">
              <IncomeForm onAddIncome={handleAddIncome} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Income History</CardTitle>
                  <CardDescription>Your recent income transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {income.length > 0 ? (
                    <div className="overflow-auto max-h-96">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">Date</th>
                            <th className="text-left py-3 px-4 font-medium">Category</th>
                            <th className="text-left py-3 px-4 font-medium">Description</th>
                            <th className="text-right py-3 px-4 font-medium">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {income
                            .sort((a, b) => b.date.getTime() - a.date.getTime())
                            .map((item) => (
                              <tr key={item.id} className="border-b hover:bg-muted/50">
                                <td className="py-3 px-4">
                                  {item.date.toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4">{item.category}</td>
                                <td className="py-3 px-4">{item.description}</td>
                                <td className="py-3 px-4 text-right font-medium text-finance-income">
                                  {formatCurrency(item.amount)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      No income transactions yet. Add your first income above.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="expenses" className="space-y-6">
              <ExpenseForm onAddExpense={handleAddExpense} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Expense History</CardTitle>
                  <CardDescription>Your recent expense transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {expenses.length > 0 ? (
                    <div className="overflow-auto max-h-96">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">Date</th>
                            <th className="text-left py-3 px-4 font-medium">Category</th>
                            <th className="text-left py-3 px-4 font-medium">Description</th>
                            <th className="text-right py-3 px-4 font-medium">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenses
                            .sort((a, b) => b.date.getTime() - a.date.getTime())
                            .map((expense) => (
                              <tr key={expense.id} className="border-b hover:bg-muted/50">
                                <td className="py-3 px-4">
                                  {expense.date.toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4">{expense.category}</td>
                                <td className="py-3 px-4">{expense.description}</td>
                                <td className="py-3 px-4 text-right font-medium text-finance-expense">
                                  {formatCurrency(expense.amount)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      No expense transactions yet. Add your first expense above.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Welcome to Your Financial Dashboard</h2>
          <p className="text-muted-foreground mb-8">
            Start by adding your income and expenses to get insights on your finances.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            <IncomeForm onAddIncome={handleAddIncome} />
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
