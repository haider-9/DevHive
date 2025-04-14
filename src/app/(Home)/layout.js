import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import MiniSidebar from "@/components/SidebarMini";

export default function Layout({ children }) {
  return (
    <div className="p-6 flex gap-6">
      <Sidebar />
      {/* <MiniSidebar /> */}
      <div className="w-full ml-24 lg:ml-[345px] space-y-6 bg-secondary rounded-2xl">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
}
