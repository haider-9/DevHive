"use client";
import {
  Button,
  Input,
  Switch,
} from "@heroui/react";
import React, { useEffect, useRef } from "react";
import { LuBell, LuSearch, LuMoon, LuSun } from "react-icons/lu";
import { useTheme } from "next-themes";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === 'k' && document.activeElement !== searchInputRef.current) {
        event.preventDefault();
        searchInputRef.current.focus();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="flex justify-around items-center *:bg-primary *:px-4 *:pb-4 *:rounded-b-2xl">
      <div className="relative max-w-lg w-full">
        <div className="relative group">
          <Input
            ref={searchInputRef}
            type="text"
            isClearable
            startContent={<LuSearch className="text-input" />}
            placeholder="Search..."
            className="text-input w-full"
            classNames={{
              inputWrapper: "bg-secondary focus:bg-secondary/80"
            }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center transition-opacity duration-200 opacity-100 group-focus-within:opacity-0 group-focus-within:pointer-events-none">
            <kbd className="px-2 py-1 text-xs font-mono font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md shadow-sm mr-1">Ctrl</kbd>
            <span className="text-xs text-gray-500 mx-1">+</span>
            <kbd className="px-2 py-1 text-xs font-mono font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md shadow-sm">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="transition-transform duration-300 hover:scale-110">
          <Button
            as="a"
            href="/notifications"
            isIconOnly
            variant="shadow"
            color="primary"
            aria-label="Go to Notifications"
            startContent={<LuBell className="text-foreground"/>}
            className="border-none text-white text-2xl"
          />
        </div>
          <Switch
            isSelected={isDark}
            size="lg"
            color="secondary"
            startContent={<LuSun />}
            endContent={<LuMoon />}
            onChange={() => setTheme(isDark ? "light" : "dark")}
          />
      </div>
    </div>
  );
};

export default Navbar;
