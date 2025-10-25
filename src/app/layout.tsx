import { AuthProvider } from "./auth-provider";
import ThemeRegistry from "./ThemeRegistry";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react"; 

export const metadata = {
  title: "Next.js Todo App",
  description: "Todo app with Supabase",
};

// Define the props type
interface RootLayoutProps {
  children: ReactNode;
}

// Apply the type to the props
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AuthProvider>{children}</AuthProvider>
          <Toaster position="bottom-right" />
        </ThemeRegistry>
      </body>
    </html>
  );
}