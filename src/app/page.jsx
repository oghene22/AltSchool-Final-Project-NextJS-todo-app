"use client";

import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "../app/auth-provider"; 

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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// Import our custom components
import TodoCard from "../components/TodoCard";
import TodoModal from "../components/TodoModal";

export default function Home() {
  const router = useRouter();
  const { session } = useAuth(); 
  const user = session?.user; 

  // State for all our data
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // State for the modal
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTodos(user);
    }
  }, [user]); 

  const fetchTodos = async (currentUser) => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTodos(data);
    } catch (error) {
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
    .filter((todo) =>
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((todo) => {
      if (filterStatus === "all") return true;
      if (filterStatus === "completed") return todo.completed;
      if (filterStatus === "incomplete") return !todo.completed;
      return true;
    });

  const openCreateModal = () => { /* ... */ };
  const openEditModal = (todo) => { /* ... */ };

  // CRUD FUNCTIONS (Unchanged)
  const handleSaveTodo = async (text, completed) => { /* ... */ };
  const handleDeleteTodo = async (id) => { /* ... */ };
  const handleToggleTodo = async (id, currentStatus) => { /* ... */ };

  //  RENDER THE UI
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
        {/* --- CONTROLS SECTION --- */}
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
              onChange={(e) => setFilterStatus(e.target.value)}
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