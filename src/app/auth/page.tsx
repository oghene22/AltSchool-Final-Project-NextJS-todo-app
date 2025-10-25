"use client";

import { useState } from "react";
import { supabase } from "../../supabase";
// Import MUI components
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
// Import react-hot-toast
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { ChangeEvent, KeyboardEvent } from "react";

export default function AuthPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred during sign up.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleLogin(); 
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="grey.100"
    >
      <Card sx={{ width: '100%', maxWidth: 500, m: 2 }}>
        <CardHeader
          title={
            <Typography variant="h5" component="h1" textAlign="center">
              Welcome to Todo App
            </Typography>
          }
        />
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Your Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Your Password"
              type="password"
              value={password}
              onChange={handlePasswordChange} 
              onKeyDown={handleKeyDown}       
              variant="outlined"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleLogin}
              disabled={loading}
              size="large"
              fullWidth
            >
              Log In
            </Button>
            <Button
              variant="outlined"
              onClick={handleSignUp}
              disabled={loading}
              size="large"
              fullWidth
            >
              Sign Up
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}