'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NavLink = ({ href, icon, children, className }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'flex w-full items-center justify-center gap-3 rounded-xl p-3 transition-colors lg:justify-start',
        {
          'bg-warning text-primary': isActive,
          'hover:bg-warning hover:text-primary': !isActive,
        },
        ...className
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
