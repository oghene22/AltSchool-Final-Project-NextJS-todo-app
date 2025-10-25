"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "../supabase";
import { useRouter, usePathname } from "next/navigation";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
// Import Session and ReactNode types
import type { Session } from "@supabase/supabase-js";
import type { ReactNode } from "react";

// Define the shape of the Context's value
interface AuthContextType {
  session: Session | null;
}

// Create context with 'undefined' as default.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;
      setSession(currentSession);
      setLoading(false); 

      if (!currentSession && pathname !== "/auth") {
        router.push("/auth");
      }
      if (currentSession && pathname === "/auth") {
        router.push("/");
      }
    };

    checkInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession); 

        if (event === "SIGNED_IN" && pathname === "/auth") {
          router.push("/");
        }
        if (event === "SIGNED_OUT" && pathname !== "/auth") {
          router.push("/auth");
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [pathname, router]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!session && pathname !== "/auth") {
    return null;
  }
  if (session && pathname === "/auth") {
    return null;
  }

  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};