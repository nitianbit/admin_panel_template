import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean; // Controls whether the dialog is open
  title?: string; // Dialog title
  message: string; // Dialog message
  onConfirm: () => void; // Callback for confirm action
  onCancel: () => void; // Callback for cancel action
  confirmText?: string; // Text for confirm button
  cancelText?: string; // Text for cancel button
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title = "Confirmation",
  message,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "No",
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
