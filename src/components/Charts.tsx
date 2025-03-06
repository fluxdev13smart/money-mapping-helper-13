
import React from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { ExpenseItem, IncomeItem, Category } from "@/types/finance";
import { formatCurrency, getCategoryColor } from "@/utils/calculations";

interface ChartsProps {
  expenses: ExpenseItem[];
  income: IncomeItem[];
}

const Charts: React.FC<ChartsProps> = ({ expenses, income }) => {
  // Prepare data for expense pie chart
  const preparePieChartData = () => {
    const categoryMap = new Map<Category, number>();
    
    expenses.forEach((expense) => {
      const currentAmount = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentAmount + expense.amount);
    });
    
    return Array.from(categoryMap).map(([category, amount]) => ({
      name: category,
      value: amount,
    })).sort((a, b) => b.value - a.value);
  };

  // Prepare data for expense vs income bar chart
  const prepareBarChartData = () => {
    const currentDate = new Date();
    const last6Months: { month: string; expenses: number; income: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${month.getFullYear()}-${month.getMonth() + 1}`;
      const monthName = month.toLocaleString('default', { month: 'short' });
      
      const monthExpenses = expenses
        .filter((expense) => {
          const expenseMonth = `${expense.date.getFullYear()}-${expense.date.getMonth() + 1}`;
          return expenseMonth === monthKey;
        })
        .reduce((sum, expense) => sum + expense.amount, 0);
        
      const monthIncome = income
        .filter((income) => {
          const incomeMonth = `${income.date.getFullYear()}-${income.date.getMonth() + 1}`;
          return incomeMonth === monthKey;
        })
        .reduce((sum, income) => sum + income.amount, 0);
      
      last6Months.push({
        month: monthName,
        expenses: monthExpenses,
        income: monthIncome,
      });
    }
    
    return last6Months;
  };

  // Prepare data for savings trend line chart
  const prepareLineChartData = () => {
    const currentDate = new Date();
    const last6Months: { month: string; savings: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${month.getFullYear()}-${month.getMonth() + 1}`;
      const monthName = month.toLocaleString('default', { month: 'short' });
      
      const monthExpenses = expenses
        .filter((expense) => {
          const expenseMonth = `${expense.date.getFullYear()}-${expense.date.getMonth() + 1}`;
          return expenseMonth === monthKey;
        })
        .reduce((sum, expense) => sum + expense.amount, 0);
        
      const monthIncome = income
        .filter((income) => {
          const incomeMonth = `${income.date.getFullYear()}-${income.date.getMonth() + 1}`;
          return incomeMonth === monthKey;
        })
        .reduce((sum, income) => sum + income.amount, 0);
      
      last6Months.push({
        month: monthName,
        savings: monthIncome - monthExpenses,
      });
    }
    
    return last6Months;
  };

  const pieChartData = preparePieChartData();
  const barChartData = prepareBarChartData();
  const lineChartData = prepareLineChartData();

  // Custom tooltip for pie chart
  const ExpensePieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-lg shadow-md text-sm">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-muted-foreground mt-1">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const BarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-lg shadow-md text-sm">
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} className="flex items-center gap-2">
              <span 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}: {formatCurrency(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const LineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-lg shadow-md text-sm">
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} className="flex items-center gap-2">
              <span 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span>Savings: {formatCurrency(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <motion.div 
          className="finance-card h-[350px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h3 className="text-lg font-medium mb-4">Expense Breakdown</h3>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationDuration={800}
                  animationBegin={200}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getCategoryColor(entry.name as Category)} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<ExpensePieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>No expense data to display</p>
            </div>
          )}
        </motion.div>

        <motion.div 
          className="finance-card h-[350px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-lg font-medium mb-4">Income vs Expenses</h3>
          {barChartData.some(item => item.income > 0 || item.expenses > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `$${value}`} 
                  width={60}
                />
                <Tooltip content={<BarTooltip />} />
                <Legend />
                <Bar 
                  dataKey="income" 
                  name="Income" 
                  fill="#059669" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                  animationBegin={300}
                />
                <Bar 
                  dataKey="expenses" 
                  name="Expenses" 
                  fill="#dc2626" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                  animationBegin={500}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>No data to display</p>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div 
        className="finance-card h-[350px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-lg font-medium mb-4">Savings Trend</h3>
        {lineChartData.some(item => item.savings !== 0) ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `$${value}`} 
                width={60}
              />
              <Tooltip content={<LineTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="savings" 
                name="Savings" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ r: 6, strokeWidth: 2 }}
                activeDot={{ r: 8 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p>No savings data to display</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Charts;
