
import React from "react";
import { Moon, Sun, Settings2, PlusCircle, Trash2 } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category, IncomeCategory } from "@/types/finance";
import { toast } from "sonner";

const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState<boolean>(false);
  const [newExpenseCategory, setNewExpenseCategory] = React.useState<string>("");
  const [newIncomeCategory, setNewIncomeCategory] = React.useState<string>("");
  const [expenseCategories, setExpenseCategories] = React.useState<Category[]>(getStoredExpenseCategories());
  const [incomeCategories, setIncomeCategories] = React.useState<IncomeCategory[]>(getStoredIncomeCategories());
  const [activeTab, setActiveTab] = React.useState<string>("expense");
  
  // Get expense categories from localStorage or use defaults
  function getStoredExpenseCategories(): Category[] {
    const defaultExpenseCategories: Category[] = [
      "Housing",
      "Transportation",
      "Food",
      "Utilities",
      "Healthcare",
      "Insurance",
      "Entertainment",
      "Shopping",
      "Personal",
      "Debt",
      "Savings",
      "Investments",
      "Education",
      "Gifts/Donations",
      "Travel",
      "Other",
    ];
    
    try {
      const storedCategories = localStorage.getItem("expense-categories");
      if (storedCategories) {
        return JSON.parse(storedCategories);
      }
    } catch (error) {
      console.error("Error loading expense categories:", error);
    }
    return defaultExpenseCategories;
  }

  // Get income categories from localStorage or use defaults
  function getStoredIncomeCategories(): IncomeCategory[] {
    const defaultIncomeCategories: IncomeCategory[] = [
      "Salary",
      "Freelance",
      "Business", 
      "Investments",
      "Gifts",
      "Other",
    ];
    
    try {
      const storedCategories = localStorage.getItem("income-categories");
      if (storedCategories) {
        return JSON.parse(storedCategories);
      }
    } catch (error) {
      console.error("Error loading income categories:", error);
    }
    return defaultIncomeCategories;
  }

  // Save expense categories to localStorage
  const saveExpenseCategories = (categories: Category[]) => {
    try {
      localStorage.setItem("expense-categories", JSON.stringify(categories));
    } catch (error) {
      console.error("Error saving expense categories:", error);
    }
  };

  // Save income categories to localStorage
  const saveIncomeCategories = (categories: IncomeCategory[]) => {
    try {
      localStorage.setItem("income-categories", JSON.stringify(categories));
    } catch (error) {
      console.error("Error saving income categories:", error);
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    toast.success(`Switched to ${theme === "dark" ? "light" : "dark"} mode`);
  };

  // Add new expense category
  const handleAddExpenseCategory = () => {
    if (!newExpenseCategory || newExpenseCategory.trim() === "") {
      toast.error("Please enter a category name");
      return;
    }

    if (expenseCategories.includes(newExpenseCategory as Category)) {
      toast.error("This category already exists");
      return;
    }

    const updatedCategories = [...expenseCategories, newExpenseCategory as Category];
    setExpenseCategories(updatedCategories);
    saveExpenseCategories(updatedCategories);
    setNewExpenseCategory("");
    toast.success(`Added expense category: ${newExpenseCategory}`);
  };

  // Add new income category
  const handleAddIncomeCategory = () => {
    if (!newIncomeCategory || newIncomeCategory.trim() === "") {
      toast.error("Please enter a category name");
      return;
    }

    if (incomeCategories.includes(newIncomeCategory as IncomeCategory)) {
      toast.error("This category already exists");
      return;
    }

    const updatedCategories = [...incomeCategories, newIncomeCategory as IncomeCategory];
    setIncomeCategories(updatedCategories);
    saveIncomeCategories(updatedCategories);
    setNewIncomeCategory("");
    toast.success(`Added income category: ${newIncomeCategory}`);
  };

  // Remove expense category
  const handleRemoveExpenseCategory = (categoryToRemove: Category) => {
    // Don't allow removing default categories (except "Other")
    if (defaultExpenseCategories.includes(categoryToRemove) && 
        categoryToRemove !== "Other") {
      toast.error("Cannot remove default categories");
      return;
    }

    const updatedCategories = expenseCategories.filter(cat => cat !== categoryToRemove);
    setExpenseCategories(updatedCategories);
    saveExpenseCategories(updatedCategories);
    
    toast.success(`Removed expense category: ${categoryToRemove}`);
  };

  // Remove income category
  const handleRemoveIncomeCategory = (categoryToRemove: IncomeCategory) => {
    // Don't allow removing default categories (except "Other")
    if (defaultIncomeCategories.includes(categoryToRemove) && 
        categoryToRemove !== "Other") {
      toast.error("Cannot remove default categories");
      return;
    }

    const updatedCategories = incomeCategories.filter(cat => cat !== categoryToRemove);
    setIncomeCategories(updatedCategories);
    saveIncomeCategories(updatedCategories);
    
    toast.success(`Removed income category: ${categoryToRemove}`);
  };

  const defaultExpenseCategories: Category[] = [
    "Housing",
    "Transportation",
    "Food",
    "Utilities",
    "Healthcare",
    "Insurance",
    "Entertainment",
    "Shopping",
    "Personal",
    "Debt",
    "Savings",
    "Investments",
    "Education",
    "Gifts/Donations",
    "Travel",
    "Other",
  ];

  const defaultIncomeCategories: IncomeCategory[] = [
    "Salary",
    "Freelance",
    "Business",
    "Investments",
    "Gifts",
    "Other",
  ];
  
  return (
    <header className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          💰 Finance Tracker
        </h1>
        
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Settings2 className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={toggleTheme}>
                {theme === "dark" ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                <span>Toggle {theme === "dark" ? "Light" : "Dark"} Mode</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsCategoryDialogOpen(true)}>
                <Settings2 className="mr-2 h-4 w-4" />
                <span>Manage Categories</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Category Management Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
            <DialogDescription>
              Add or remove categories to customize your tracking.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="expense" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expense">Expense Categories</TabsTrigger>
              <TabsTrigger value="income">Income Categories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="expense" className="space-y-4 mt-4">
              <div className="flex space-x-2">
                <Input 
                  placeholder="New expense category" 
                  value={newExpenseCategory}
                  onChange={(e) => setNewExpenseCategory(e.target.value)}
                />
                <Button onClick={handleAddExpenseCategory} type="button">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-1">
                {expenseCategories.map((cat) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                  >
                    <span className="truncate">{cat}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveExpenseCategory(cat)}
                      className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                      disabled={defaultExpenseCategories.includes(cat) && cat !== "Other"}
                    >
                      <span className="sr-only">Remove</span>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="income" className="space-y-4 mt-4">
              <div className="flex space-x-2">
                <Input 
                  placeholder="New income category" 
                  value={newIncomeCategory}
                  onChange={(e) => setNewIncomeCategory(e.target.value)}
                />
                <Button onClick={handleAddIncomeCategory} type="button">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-1">
                {incomeCategories.map((cat) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                  >
                    <span className="truncate">{cat}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveIncomeCategory(cat)}
                      className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                      disabled={defaultIncomeCategories.includes(cat) && cat !== "Other"}
                    >
                      <span className="sr-only">Remove</span>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button onClick={() => setIsCategoryDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
