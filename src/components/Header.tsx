
import React from "react";
import { motion } from "framer-motion";
import { ChartPieIcon } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full bg-primary p-1.5 text-white shadow-sm"
          >
            <ChartPieIcon size={24} />
          </motion.div>
          <motion.h1 
            className="text-xl font-semibold tracking-tight"
            whileHover={{ scale: 1.02 }}
          >
            Where Did My Money Go?
          </motion.h1>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
