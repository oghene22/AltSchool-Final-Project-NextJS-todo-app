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

export default function TodoModal({ open, onClose, onSave, todo }) {
  const [text, setText] = useState("");
  const [completed, setCompleted] = useState(false);

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
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          {todo && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
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