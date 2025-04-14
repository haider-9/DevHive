import Link from "next/link";
import Image from "next/image";
import {
  LuHistory,
  LuLink,
  LuBookmark,
  LuSettings,
  LuUser,
} from "react-icons/lu";
import { FaHouse } from "react-icons/fa6"

const sideLinks = [
  { name: "Home", icon: <FaHouse />, href: "/" },
  { name: "History", icon: <LuHistory />, href: "/history" },
  { name: "Submit a Link", icon: <LuLink />, href: "/submit-link" },
  { name: "Bookmarks", icon: <LuBookmark />, href: "/bookmarks" },
];

const MiniSidebar = () => {
  return (
    <div className="lg:hidden py-2 px-4 fixed top-0 left-0 w-full h-full bg-primary z-10 max-w-24 flex flex-col justify-between items-center">
      <nav className="space-y-2 p-4 py-6">
        <Image
          src="/next.svg"
          className="invert w-[80%] mx-auto mb-10"
          alt="Logo"
          width={100}
          height={100}
        />
        {sideLinks.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="w-full p-2 flex flex-col items-center justify-center gap-1 hover:bg-secondary rounded-2xl transition-colors">
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs text-center ml-2">{item.name}</span>
          </Link>
        ))}
      </nav>
      <div>
        <Link
          href="/"
          className="w-full p-2 flex flex-col items-center justify-center gap-1 hover:bg-secondary rounded-2xl transition-colors">
          <LuUser className="text-xl" />
          <span className="text-xs text-center ml-2">Profile</span>
        </Link>
        <Link
          href="/"
          className="w-full p-2 flex flex-col items-center justify-center gap-1 hover:bg-secondary rounded-2xl transition-colors">
          <LuSettings className="text-xl" />
          <span className="text-xs text-center ml-2">Setting</span>
        </Link>
      </div>
    </div>
  );
};

export default MiniSidebar;
