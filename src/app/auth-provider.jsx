"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useRouter, usePathname } from "next/navigation";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const user = session?.user;

        if (!user && pathname !== "/auth") {
          router.push("/auth");
        }
        if (user && pathname === "/auth") {
          router.push("/");
        }
        setIsLoading(false);
      }
    );

    const checkInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session && pathname !== "/auth") {
        router.push("/auth");
      }
      setIsLoading(false);
    };

    checkInitialSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, [pathname, router]);

  if (isLoading) {
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

  return <>{children}</>;
}