"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (value: string) => void
}

const SERVICE_OPTIONS = [
  "Interior Design Consultation",
  "Space Planning",
  "Color Consultation",
  "Furniture Selection",
  "Material Selection",
  "Lighting Design",
]

export function AddServiceDialog({ open, onOpenChange, onAdd }: AddServiceDialogProps) {
  const [selected, setSelected] = useState("")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-none bg-white p-6 shadow-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Add Service</DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_OPTIONS.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selected) {
                onAdd(selected)
                setSelected("")
                onOpenChange(false)
              }
            }}
            disabled={!selected}
          >
            Add Service
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

