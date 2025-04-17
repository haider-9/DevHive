"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NavLink = ({ href, className, children, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  // If className is a function, call it with isActive
  const resolvedClassName = typeof className === 'function' 
    ? className({ isActive }) 
    : cn(
        'flex w-full items-center justify-center gap-3 rounded-xl p-3 transition-colors lg:justify-start',
        {
          'bg-warning text-primary': isActive,
          'hover:bg-warning hover:text-primary': !isActive,
        },
        className
      );

  return (
    <Link 
      href={href} 
      className={resolvedClassName}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavLink;
