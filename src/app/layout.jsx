import { AuthProvider } from "./auth-provider";
import ThemeRegistry from "./ThemeRegistry"; 
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Next.js Todo App",
  description: "Todo app with Supabase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry> 
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster position="bottom-right" /> 
        </ThemeRegistry>
      </body>
    </html>
  );
}