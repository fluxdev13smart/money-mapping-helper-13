
import React, { useEffect } from "react";
import Header from "./Header";
import { motion } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    let lastScrollTop = 0;
    let isAnimating = false;
    
    const handleScroll = () => {
      if (isAnimating) return;
      
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if user has scrolled to the bottom
      if (scrollTop + windowHeight >= documentHeight - 5) {
        if (!isAnimating && scrollTop > lastScrollTop) {
          isAnimating = true;
          
          // Apply the bounce animation at the bottom without hiding overflow
          document.body.classList.add("scroll-bounce-bottom");
          
          setTimeout(() => {
            document.body.classList.remove("scroll-bounce-bottom");
            isAnimating = false;
          }, 800);
        }
      }
      
      // Check if user has scrolled to the top
      if (scrollTop <= 0) {
        if (!isAnimating && scrollTop < lastScrollTop) {
          isAnimating = true;
          
          // Apply the bounce animation at the top without hiding overflow
          document.body.classList.add("scroll-bounce-top");
          
          setTimeout(() => {
            document.body.classList.remove("scroll-bounce-top");
            isAnimating = false;
          }, 800);
        }
      }
      
      lastScrollTop = scrollTop;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} "Where Did My Money Go?" Analyzer | Made by -Saeid Mohammad | <a 
            href="https://discord.com/users/816551651695525908" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Discord
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Layout;
