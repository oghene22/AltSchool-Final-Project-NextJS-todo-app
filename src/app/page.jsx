"use client";

import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

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

  // State for all our data
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); 

  // State for the modal
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);

  // FETCH USER AND TODOS ON LOAD
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
        fetchTodos(data.session.user);
      } else {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

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

  // LOGOUT FUNCTION
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  //  (Filtering)
  const filteredTodos = todos
    .filter((todo) =>
      // First, filter by search term
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((todo) => {
      // ADD logic for status filter
      if (filterStatus === "all") return true;
      if (filterStatus === "completed") return todo.completed;
      if (filterStatus === "incomplete") return !todo.completed;
      return true;
    });

  // MODAL HANDLERS
  const openCreateModal = () => {
    setCurrentTodo(null); 
    setModalOpen(true);
  };

  const openEditModal = (todo) => {
    setCurrentTodo(todo); 
    setModalOpen(true);
  };

  // CRUD FUNCTIONS (Create, Read, Update, Delete)
  const handleSaveTodo = async (text, completed) => {
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
      } catch (error) {
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
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw error;
      setTodos(todos.filter((todo) => todo.id !== id));
      toast.success("Todo deleted.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleToggleTodo = async (id, currentStatus) => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .update({ completed: !currentStatus })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setTodos(todos.map((todo) => (todo.id === id ? data : todo)));
    } catch (error) {
      toast.error(error.message);
    }
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
        {/* UPDATED CONTROLS SECTION --- */}
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
        
        {/* --- ADD TODO BUTTON --- */}
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