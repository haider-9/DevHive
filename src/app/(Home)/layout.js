import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function Layout({ children }) {
  return (
    <div className="p-2 sm:p-4 md:p-6 flex gap-2 sm:gap-4 md:gap-6 min-h-screen">
      <Sidebar />
      <div className="w-full ml-16 sm:ml-20 lg:ml-[345px] space-y-4 md:space-y-6 bg-secondary rounded-xl md:rounded-2xl transition-all duration-300">
        <Navbar />
        <main className="px-2 sm:px-4 md:px-6 pb-6">{children}</main>
      </div>
    </div>
  );
}
