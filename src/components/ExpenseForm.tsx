import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, ExpenseItem } from "@/types/finance";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface ExpenseFormProps {
  onAddExpense: (expense: ExpenseItem) => void;
}

// Get categories from localStorage or use defaults
const getStoredCategories = (): Category[] => {
  try {
    const storedCategories = localStorage.getItem("expense-categories");
    if (storedCategories) {
      return JSON.parse(storedCategories);
    }
  } catch (error) {
    console.error("Error loading categories:", error);
  }
  return defaultExpenseCategories;
};

// Save categories to localStorage
const saveCategories = (categories: Category[]) => {
  try {
    localStorage.setItem("expense-categories", JSON.stringify(categories));
  } catch (error) {
    console.error("Error saving categories:", error);
  }
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const [amount, setAmount] = useState<string>("");
  const [displayAmount, setDisplayAmount] = useState<string>("0.00");
  const [category, setCategory] = useState<Category>("Housing");
  const [customCategory, setCustomCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isAmountFocused, setIsAmountFocused] = useState<boolean>(false);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>(getStoredCategories());

  // Animated amount display effect
  useEffect(() => {
    if (amount && isAmountFocused) {
      const targetAmount = parseFloat(amount);
      let current = 0;
      const increment = targetAmount / 20; // Divide into 20 steps for animation
      const animateValue = () => {
        if (current < targetAmount) {
          current += increment;
          if (current > targetAmount) current = targetAmount;
          setDisplayAmount(current.toFixed(2));
          requestAnimationFrame(animateValue);
        }
      };
      animateValue();
    } else if (!isAmountFocused && amount) {
      setDisplayAmount(parseFloat(amount).toFixed(2));
    } else {
      setDisplayAmount("0.00");
    }
  }, [amount, isAmountFocused]);

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategory(value as Category);
    if (value !== "Other") {
      setCustomCategory("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Use custom category if "Other" is selected and a custom value is provided
    const finalCategory = category === "Other" && customCategory ? 
      customCategory as Category : category;

    const newExpense: ExpenseItem = {
      id: uuidv4(),
      amount: parseFloat(amount),
      category: finalCategory,
      description,
      date,
    };

    onAddExpense(newExpense);
    toast.success("Expense added successfully");
    
    // Reset form
    setAmount("");
    setDisplayAmount("0.00");
    setCategory("Housing");
    setDescription("");
    setCustomCategory("");
    setDate(new Date());
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-4">
      {!isFormOpen ? (
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="finance-card cursor-pointer flex items-center justify-center py-12"
          onClick={() => setIsFormOpen(true)}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <PlusIcon className="h-10 w-10" />
            <p className="font-medium">Add Expense</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="finance-card"
        >
          <h3 className="text-lg font-medium mb-4">Add Expense</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      onFocus={() => setIsAmountFocused(true)}
                      onBlur={() => setIsAmountFocused(false)}
                      className="pl-7 pr-[4.5rem]"
                      placeholder="0.00"
                      required
                    />
                    <AnimatePresence>
                      {isAmountFocused && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 font-mono"
                        >
                          ${displayAmount}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={category} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Custom Category Input */}
                <AnimatePresence>
                  {category === "Other" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        className="mt-2"
                        placeholder="Enter custom category"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Rent, groceries, restaurant, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button type="submit" className="bg-finance-expense hover:bg-finance-expense/90">
                  Add Expense
                </Button>
              </motion.div>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default ExpenseForm;
