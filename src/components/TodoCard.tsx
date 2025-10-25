"use client";

import {
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Todo {
  id: number;
  created_at: string;
  text: string;
  completed: boolean;
  user_id: string;
}

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: number, currentStatus: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export default function TodoCard({ todo, onToggle, onEdit, onDelete }: TodoCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{ bgcolor: todo.completed ? "grey.100" : "white" }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Checkbox
            checked={todo.completed}
            onChange={() => onToggle(todo.id, todo.completed)}
            inputProps={{ "aria-label": "Mark as complete" }}
          />
          <Typography
            sx={{
              flexGrow: 1,
              textDecoration: todo.completed ? "line-through" : "none",
              color: todo.completed ? "grey.500" : "text.primary",
            }}
          >
            {todo.text}
          </Typography>
          <IconButton
            aria-label="edit"
            color="primary"
            onClick={() => onEdit(todo)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            color="error"
            onClick={() => onDelete(todo.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
}