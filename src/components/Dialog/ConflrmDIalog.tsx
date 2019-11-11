import React, { FC, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

export const ConfirmDialog: FC<{
  title?: string
  message?: string
  open: boolean
  confirmLabel?: string
  onConfirm: () => void
  cancelLabel?: string
  onCancel: () => void
}> = props => {
  const [open, setOpen] = React.useState(props.open)

  useEffect(() => {
    setOpen(props.open)
  }, [props.open])

  const handleConfirm = () => {
    props.onConfirm()
    setOpen(false)
  }

  const handleCancel = () => {
    props.onCancel()
    setOpen(false)
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleConfirm} color="primary">
            {props.confirmLabel || 'Confirm'}
          </Button>
          <Button onClick={handleCancel} color="primary">
            {props.cancelLabel || 'Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
