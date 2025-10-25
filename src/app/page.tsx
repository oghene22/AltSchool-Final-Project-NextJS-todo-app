"use client";

import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "./auth-provider";
import type { User } from "@supabase/supabase-js"; 

// Import MUI Components
import {
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Container,
  Stack,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent, 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// Import our custom components
import TodoCard from "../components/TodoCard";
import TodoModal from "../components/TodoModal";

interface Todo {
  id: number;
  created_at: string;
  text: string;
  completed: boolean;
  user_id: string;
}

export default function Home() {
  const router = useRouter();
  const { session } = useAuth();
  const user = session?.user;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (user) {
      fetchTodos(user);
    }
  }, [user]);

  const fetchTodos = async (currentUser: User) => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) {
        setTodos(data);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const filteredTodos = todos
    .filter((todo: Todo) => 
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((todo: Todo) => { 
      if (filterStatus === "all") return true;
      if (filterStatus === "completed") return todo.completed;
      if (filterStatus === "incomplete") return !todo.completed;
      return true;
    });

  const openCreateModal = () => {
    setCurrentTodo(null);
    setModalOpen(true);
  };

  const openEditModal = (todo: Todo) => {
    setCurrentTodo(todo);
    setModalOpen(true);
  };

  const handleSaveTodo = async (text: string, completed: boolean) => {
    if (!user) return;

    if (currentTodo) {
      try {
        const { data, error } = await supabase
          .from("todos")
          .update({ text, completed })
          .eq("id", currentTodo.id)
          .select()
          .single();

        if (error) throw error;

        setTodos(
          todos.map((todo) => (todo.id === currentTodo.id ? data : todo))
        );
        toast.success("Todo updated!");
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      try {
        const { data, error } = await supabase
          .from("todos")
          .insert({ text, completed, user_id: user.id })
          .select()
          .single();

        if (error) throw error;

        setTodos([data, ...todos]);
        toast.success("Todo created!");
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw error;
      setTodos(todos.filter((todo) => todo.id !== id));
      toast.success("Todo deleted.");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleToggleTodo = async (id: number, currentStatus: boolean) => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .update({ completed: !currentStatus })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setTodos(todos.map((todo) => (todo.id === id ? data : todo)));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterStatus(event.target.value as string);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" component="h1">
            My Todo List
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="Search Todos..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter By</InputLabel>
            <Select
              value={filterStatus}
              label="Filter By"
              onChange={handleFilterChange}
            >
              <MenuItem value={"all"}>All</MenuItem>
              <MenuItem value={"completed"}>Completed</MenuItem>
              <MenuItem value={"incomplete"}>Incomplete</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateModal}
          >
            Add Todo
          </Button>
        </Box>

        {/* --- TODO LIST --- */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2}>
            {filteredTodos.length === 0 ? (
              <Typography textAlign="center" color="grey.500">
                {searchTerm
                  ? "No todos match your search."
                  : "Your list is empty. Add a new todo!"}
              </Typography>
            ) : (
              filteredTodos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onEdit={openEditModal}
                  onDelete={handleDeleteTodo}
                />
              ))
            )}
          </Stack>
        )}
      </Container>

      {/* --- MODAL --- */}
      <TodoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTodo}
        todo={currentTodo}
      />
    </Box>
  );
}