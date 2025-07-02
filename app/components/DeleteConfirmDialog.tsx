import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog = ({
  isOpen,
  title,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this post?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            You are about to delete &ldquo;
            <span className="text-indigo-400">{title}</span>&rdquo;. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onClose}
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-rose-600 text-white hover:bg-rose-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
