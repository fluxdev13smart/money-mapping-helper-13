
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
import { IncomeCategory, IncomeItem } from "@/types/finance";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface IncomeFormProps {
  onAddIncome: (income: IncomeItem) => void;
}

const incomeCategories: IncomeCategory[] = [
  "Salary",
  "Freelance",
  "Business",
  "Investments",
  "Gifts",
  "Other",
];

const IncomeForm: React.FC<IncomeFormProps> = ({ onAddIncome }) => {
  const [amount, setAmount] = useState<string>("");
  const [displayAmount, setDisplayAmount] = useState<string>("0.00");
  const [category, setCategory] = useState<IncomeCategory>("Salary");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isAmountFocused, setIsAmountFocused] = useState<boolean>(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const newIncome: IncomeItem = {
      id: uuidv4(),
      amount: parseFloat(amount),
      category,
      description,
      date,
    };

    onAddIncome(newIncome);
    toast.success("Income added successfully");
    
    // Reset form
    setAmount("");
    setDisplayAmount("0.00");
    setCategory("Salary");
    setDescription("");
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
            <p className="font-medium">Add Income</p>
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
          <h3 className="text-lg font-medium mb-4">Add Income</h3>
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
                  onValueChange={(value) => setCategory(value as IncomeCategory)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Monthly salary, freelance project, etc."
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
                      captionLayout="dropdown-buttons"
                      fromYear={2020}
                      toYear={2030}
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
                <Button type="submit" className="bg-finance-income hover:bg-finance-income/90">
                  Add Income
                </Button>
              </motion.div>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default IncomeForm;
