
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

type ViewMode = "days" | "months" | "years";

function CustomCaption(props: React.PropsWithChildren<{
  displayMonth: Date;
  onChange?: (date: Date) => void;
}>) {
  const [viewMode, setViewMode] = React.useState<ViewMode>("days");
  const [selectedYear, setSelectedYear] = React.useState<number>(props.displayMonth.getFullYear());
  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  }, []);

  const months = React.useMemo(() => [
    { name: "January", value: 0 },
    { name: "February", value: 1 },
    { name: "March", value: 2 },
    { name: "April", value: 3 },
    { name: "May", value: 4 },
    { name: "June", value: 5 },
    { name: "July", value: 6 },
    { name: "August", value: 7 },
    { name: "September", value: 8 },
    { name: "October", value: 9 },
    { name: "November", value: 10 },
    { name: "December", value: 11 },
  ], []);

  const handleViewChange = () => {
    if (viewMode === "days") {
      setViewMode("months");
    } else if (viewMode === "months") {
      setViewMode("years");
    } else {
      setViewMode("days");
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(selectedYear, monthIndex, 1);
    props.onChange?.(newDate);
    setViewMode("days");
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setViewMode("months");
  };

  const handlePreviousMonth = () => {
    const previousMonth = new Date(props.displayMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    props.onChange?.(previousMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(props.displayMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    props.onChange?.(nextMonth);
  };

  return (
    <div className="flex justify-center pt-1 relative items-center">
      {viewMode === "days" && (
        <>
          <div 
            className="text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1 transition-colors"
            onClick={handleViewChange}
          >
            {props.displayMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
          <div className="space-x-1 flex items-center absolute left-1">
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePreviousMonth}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-7 w-7 p-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
          </div>
          <div className="space-x-1 flex items-center absolute right-1">
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNextMonth}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-7 w-7 p-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </div>
        </>
      )}

      {viewMode === "months" && (
        <>
          <div 
            className="text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1 transition-colors"
            onClick={handleViewChange}
          >
            {selectedYear}
          </div>
        </>
      )}

      {viewMode === "years" && (
        <>
          <div 
            className="text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1 transition-colors"
            onClick={handleViewChange}
          >
            Years
          </div>
        </>
      )}

      <AnimatePresence mode="wait">
        {viewMode === "months" && (
          <motion.div 
            className="absolute top-10 left-0 right-0 bg-background border rounded-md z-10 p-2 grid grid-cols-3 gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {months.map((month) => (
              <div
                key={month.value}
                className="text-center py-1 px-2 cursor-pointer hover:bg-accent rounded"
                onClick={() => handleMonthSelect(month.value)}
              >
                {month.name.substring(0, 3)}
              </div>
            ))}
          </motion.div>
        )}

        {viewMode === "years" && (
          <motion.div 
            className="absolute top-10 left-0 right-0 bg-background border rounded-md z-10 p-2 grid grid-cols-3 gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {years.map((year) => (
              <div
                key={year}
                className="text-center py-1 px-2 cursor-pointer hover:bg-accent rounded"
                onClick={() => handleYearSelect(year)}
              >
                {year}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState<Date>(props.month || new Date());

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={month.toString()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <DayPicker
          showOutsideDays={showOutsideDays}
          className={cn("p-3 pointer-events-auto", className)}
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "hidden", // Hide the default caption
            nav: "hidden", // Hide the default navigation
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
              "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: cn(
              buttonVariants({ variant: "ghost" }),
              "h-9 w-9 p-0 font-normal aria-selected:opacity-100 transition-transform hover:scale-110"
            ),
            day_range_end: "day-range-end",
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside:
              "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle:
              "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
            ...classNames,
          }}
          components={{
            Caption: ({ displayMonth }) => 
              <CustomCaption 
                displayMonth={displayMonth} 
                onChange={setMonth} 
              />
          }}
          month={month}
          onMonthChange={setMonth}
          {...props}
        />
      </motion.div>
    </AnimatePresence>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
