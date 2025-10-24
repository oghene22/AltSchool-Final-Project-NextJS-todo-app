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

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      toast.error(error.message);
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
      toast.error(error.message);
    } finally {
      setLoading(false);
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
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Your Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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