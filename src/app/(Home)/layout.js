"use client"
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";

export default function Layout({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 1000);
      };
      
      // Set initial value
      handleResize();
      
      // Add event listener
      window.addEventListener("resize", handleResize);
      
      // Clean up
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <div className="p-2 sm:p-4 md:p-6 flex flex-col md:flex-row gap-2 sm:gap-4 md:gap-6 min-h-screen">
      <div className={`${isMobile ? 'fixed bottom-0 left-0 right-0 z-50 bg-primary' : 'sticky top-0 h-screen'}`}>
        <Sidebar isMobile={isMobile} />
      </div>
      
      <div className={`w-full transition-all duration-300
        ${isMobile ? 'ml-0 mb-16' : 'ml-16 sm:ml-20 lg:ml-[345px]'} 
        space-y-4 md:space-y-6 bg-secondary rounded-xl md:rounded-2xl`}>
        <Navbar />
        <main className="px-2 sm:px-4 md:px-6 pb-6">{children}</main>
      </div>
    </div>
  );
}
