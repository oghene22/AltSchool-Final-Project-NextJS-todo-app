"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import type { ChangeEvent, KeyboardEvent } from "react";

// Define the Todo type
interface Todo {
  id: number;
  created_at: string;
  text: string;
  completed: boolean;
  user_id: string;
}

// Define the props for this modal component
interface TodoModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (text: string, completed: boolean) => void;
  todo: Todo | null;
}

export default function TodoModal({ open, onClose, onSave, todo }: TodoModalProps) {
  const [text, setText] = useState<string>("");
  const [completed, setCompleted] = useState<boolean>(false);

  // Reset form when modal opens/closes or todo changes
  useEffect(() => {
    if (open) {
      if (todo) {
        setText(todo.text);
        setCompleted(todo.completed);
      } else {
        setText("");
        setCompleted(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, todo]);

  const handleSave = () => {
    onSave(text, completed);
    onClose();
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleCompletedChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCompleted(event.target.checked);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSave();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{todo ? "Edit Todo" : "Create New Todo"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 2 }}>
          <TextField
            autoFocus
            label="What do you want to do?"
            fullWidth
            variant="outlined"
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
          />
          {todo && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={completed}
                  onChange={handleCompletedChange}
                />
              }
              label="Completed"
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}