import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "Dashboard | Splitter",
  description: "Group expense manager",
};

export default function DashboardLayout({ children }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Navbar />
        <main className="pt-20 px-4 max-w-5xl mx-auto">{children}</main>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </>
  );
}
