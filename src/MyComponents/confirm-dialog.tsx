import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface IProps {
  showConfirmDialog: boolean
  setShowConfirmDialog: (val: boolean) => void
  handleConfirm: () => void
  title: string
  desc: string
  confirmText: string
  cancelText: string
  isLoading?: boolean
}

export default function ConfirmDialog({
  showConfirmDialog,
  setShowConfirmDialog,
  handleConfirm,
  title,
  desc,
  confirmText,
  cancelText,
  isLoading,
}: IProps) {
  return (
    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

