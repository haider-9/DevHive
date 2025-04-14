import { Inter, Recursive, Spline_Sans } from "next/font/google";
import "@/app/globals.css";
import { UIProvider } from "@/providers/NextUIProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });
const recursive = Recursive({ subsets: ["latin"] });

export const metadata = {
  title: "DevHive",
  description:
    "DevHive: Your daily dose of developer news, insights, and community. Stay up-to-date with the latest tech trends, discover valuable resources, and connect with fellow developers in one centralized hub.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${recursive.className} antialiased bg-primary`}>
        <UIProvider>
          {children}
        </UIProvider>
        <Toaster
          position="bottom-right"
        />
      </body>
    </html>
  );
}
