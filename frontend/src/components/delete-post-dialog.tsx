"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DeletePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeletePostDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeletePostDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="modal-description">
        <DialogHeader>
          <DialogTitle>Please confirm if you wish to 
          delete the post</DialogTitle>
        </DialogHeader>
        <DialogDescription>
            Are you sure you want to delete the post? Once deleted, it cannot be recovered.
        </DialogDescription>
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
            </Button>
            <Button onClick={onConfirm} type="button" variant="destructive">Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

