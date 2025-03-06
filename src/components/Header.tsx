
import React from "react";
import { Moon, Sun, Settings } from "lucide-react";
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
import { Category } from "@/types/finance";
import { toast } from "sonner";

const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState<boolean>(false);
  const [newCategory, setNewCategory] = React.useState<string>("");
  const [expenseCategories, setExpenseCategories] = React.useState<Category[]>(getStoredCategories());
  
  // Get categories from localStorage or use defaults
  function getStoredCategories(): Category[] {
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
      console.error("Error loading categories:", error);
    }
    return defaultExpenseCategories;
  }

  // Save categories to localStorage
  const saveCategories = (categories: Category[]) => {
    try {
      localStorage.setItem("expense-categories", JSON.stringify(categories));
    } catch (error) {
      console.error("Error saving categories:", error);
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    toast.success(`Switched to ${theme === "dark" ? "light" : "dark"} mode`);
  };

  // Add new category
  const handleAddCategory = () => {
    if (!newCategory || newCategory.trim() === "") {
      toast.error("Please enter a category name");
      return;
    }

    if (expenseCategories.includes(newCategory as Category)) {
      toast.error("This category already exists");
      return;
    }

    const updatedCategories = [...expenseCategories, newCategory as Category];
    setExpenseCategories(updatedCategories);
    saveCategories(updatedCategories);
    setNewCategory("");
    toast.success(`Added category: ${newCategory}`);
    setIsCategoryDialogOpen(false);
  };

  // Remove category
  const handleRemoveCategory = (categoryToRemove: Category) => {
    // Don't allow removing default categories
    if (defaultExpenseCategories.includes(categoryToRemove) && 
        categoryToRemove !== "Other") {
      toast.error("Cannot remove default categories");
      return;
    }

    const updatedCategories = expenseCategories.filter(cat => cat !== categoryToRemove);
    setExpenseCategories(updatedCategories);
    saveCategories(updatedCategories);
    
    toast.success(`Removed category: ${categoryToRemove}`);
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
  
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          💰 Finance Tracker
        </h1>
        
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Settings className="h-4 w-4" />
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
                <Settings className="mr-2 h-4 w-4" />
                <span>Manage Categories</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Category Management Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Expense Categories</DialogTitle>
            <DialogDescription>
              Add or remove expense categories to customize your tracking.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="flex space-x-2">
              <Input 
                placeholder="New category name" 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button onClick={handleAddCategory} type="button">Add</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-1">
              {expenseCategories.map((cat) => (
                <div
                  key={cat}
                  className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                >
                  <span className="truncate">{cat}</span>
                  {(!defaultExpenseCategories.includes(cat) || cat === "Other") && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCategory(cat)}
                      className="h-7 w-7"
                    >
                      <span className="sr-only">Remove</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsCategoryDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
