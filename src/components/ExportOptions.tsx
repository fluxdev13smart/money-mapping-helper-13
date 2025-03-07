
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExpenseItem, IncomeItem } from "@/types/finance";
import { exportAsCSV } from "@/utils/storage";
import { FinancialSummary } from "@/types/finance";
import { formatCurrency, formatPercentage } from "@/utils/calculations";
import { Download, FileText, ChevronDown } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ExportOptionsProps {
  expenses: ExpenseItem[];
  income: IncomeItem[];
  summary: FinancialSummary;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ expenses, income, summary }) => {
  const handleCSVExport = () => {
    const csvContent = exportAsCSV(expenses, income);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", "money_tracker_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("CSV exported successfully");
  };

  const handlePDFExport = async () => {
    // Create a temporary div to render the report content
    const reportContainer = document.createElement("div");
    reportContainer.className = "pdf-report p-8 bg-white text-black";
    reportContainer.style.width = "595px"; // Standard A4 width in pixels (72dpi)
    reportContainer.style.position = "absolute";
    reportContainer.style.left = "-9999px";
    
    // Generate the report content with adjusted styling for better fit
    reportContainer.innerHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 100%; font-size: 12px;">
        <h1 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; text-align: center;">Financial Summary Report</h1>
        <p style="text-align: center; font-size: 12px; margin-bottom: 15px;">Generated on ${new Date().toLocaleDateString()}</p>
        
        <div style="margin-bottom: 15px;">
          <h2 style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">Overview</h2>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-weight: bold;">Total Income:</span>
            <span>${formatCurrency(summary.totalIncome)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-weight: bold;">Total Expenses:</span>
            <span>${formatCurrency(summary.totalExpenses)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-weight: bold;">Balance:</span>
            <span>${formatCurrency(summary.balance)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-weight: bold;">Savings Rate:</span>
            <span>${formatPercentage(summary.savingsRate)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-weight: bold;">Largest Expense Category:</span>
            <span>${summary.largestExpenseCategory.category} (${formatPercentage(summary.largestExpenseCategory.percentage)})</span>
          </div>
        </div>
        
        <div style="margin-bottom: 15px;">
          <h2 style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">Expense Breakdown</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="text-align: left; padding: 4px; border-bottom: 1px solid #e2e8f0;">Category</th>
                <th style="text-align: right; padding: 4px; border-bottom: 1px solid #e2e8f0;">Amount</th>
                <th style="text-align: right; padding: 4px; border-bottom: 1px solid #e2e8f0;">Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${summary.expensesByCategory.map(category => `
                <tr>
                  <td style="text-align: left; padding: 4px; border-bottom: 1px solid #e2e8f0;">${category.category}</td>
                  <td style="text-align: right; padding: 4px; border-bottom: 1px solid #e2e8f0;">${formatCurrency(category.amount)}</td>
                  <td style="text-align: right; padding: 4px; border-bottom: 1px solid #e2e8f0;">${formatPercentage(category.percentage)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        
        <div>
          <h2 style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">Recent Transactions</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="text-align: left; padding: 4px; border-bottom: 1px solid #e2e8f0;">Date</th>
                <th style="text-align: left; padding: 4px; border-bottom: 1px solid #e2e8f0;">Type</th>
                <th style="text-align: left; padding: 4px; border-bottom: 1px solid #e2e8f0;">Category</th>
                <th style="text-align: left; padding: 4px; border-bottom: 1px solid #e2e8f0;">Description</th>
                <th style="text-align: right; padding: 4px; border-bottom: 1px solid #e2e8f0;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${[...income.map(item => ({
                date: item.date,
                type: "Income",
                category: item.category,
                description: item.description,
                amount: item.amount
              })), ...expenses.map(item => ({
                date: item.date,
                type: "Expense",
                category: item.category,
                description: item.description,
                amount: -item.amount
              }))]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map(transaction => `
                  <tr>
                    <td style="text-align: left; padding: 4px; border-bottom: 1px solid #e2e8f0;">${new Date(transaction.date).toLocaleDateString()}</td>
                    <td style="text-align: left; padding: 4px; border-bottom: 1px solid #e2e8f0;">${transaction.type}</td>
                    <td style="text-align: left; padding: 4px; border-bottom: 1px solid #e2e8f0;">${transaction.category}</td>
                    <td style="text-align: left; padding: 4px; border-bottom: 1px solid #e2e8f0;">${transaction.description}</td>
                    <td style="text-align: right; padding: 4px; border-bottom: 1px solid #e2e8f0; ${transaction.type === 'Income' ? 'color: #059669;' : 'color: #dc2626;'}">${formatCurrency(transaction.amount)}</td>
                  </tr>
                `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    document.body.appendChild(reportContainer);
    
    try {
      const canvas = await html2canvas(reportContainer, { 
        scale: 1.5,
        useCORS: true,
        logging: false
      });
      
      // Create PDF with A4 dimensions (210mm x 297mm)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      // Calculate proper scaling to fit the content onto A4
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(
        canvas.toDataURL("image/png"), 
        "PNG", 
        0, 
        0, 
        imgWidth, 
        imgHeight,
        "",
        "FAST"
      );
      
      pdf.save("financial_report.pdf");
      
      toast.success("PDF report exported successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report");
    } finally {
      document.body.removeChild(reportContainer);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-end"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCSVExport}>
            <FileText className="h-4 w-4 mr-2" />
            <span>Export as CSV</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePDFExport}>
            <FileText className="h-4 w-4 mr-2" />
            <span>Export as PDF</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};

export default ExportOptions;
