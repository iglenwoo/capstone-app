import { default as React, FC, useContext, useState } from 'react'
import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from '@material-ui/core'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
} from '@material-ui/icons'
import { Id, serviceOptions } from './Ids'
import { IdContext } from './Ids'
import { useStyles } from './Ids'
import { Autocomplete } from '@material-ui/lab'

export const EditableId: FC<{
  id: Id
  index: number
}> = props => {
  const classes = useStyles()
  const { handleRemoveId, handleSaveId } = useContext(IdContext)
  const [onEdit, setOnEdit] = useState(false)
  const [id, setId] = useState<Id>(props.id)

  const handleCancelClick = () => {
    setId(props.id)
    setOnEdit(false)
  }

  const _saveId = () => {
    if (props.id.service !== id.service || props.id.value !== id.value) {
      handleSaveId(props.index, id, () => {
        setOnEdit(false)
      })
    }
  }
  const handleEnterToSave = (e: any) => {
    if (e.key === 'Enter') {
      _saveId()
    }
  }
  const handleSaveClick = () => {
    _saveId()
  }
  const handleEditClick = () => {
    setOnEdit(true)
  }
  const handleDeleteClick = () => {
    handleRemoveId(props.index)
  }

  return (
    <ListItem dense>
      {onEdit ? (
        <>
          <ListItemText className={classes.value}>
            <Autocomplete
              freeSolo
              autoHighlight
              autoSelect
              disableOpenOnFocus
              options={serviceOptions}
              value={id.service}
              onChange={(e, newValue) => {
                if (newValue) {
                  setId({
                    ...id,
                    service: newValue,
                  })
                }
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  autoFocus
                  onBlur={e => {
                    setId({
                      ...id,
                      service: e.currentTarget.value,
                    })
                  }}
                />
              )}
            />
          </ListItemText>
          <ListItemText className={classes.value}>
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              value={id.value}
              onChange={e =>
                setId({
                  ...id,
                  value: e.currentTarget.value,
                })
              }
              onKeyPress={handleEnterToSave}
            />
          </ListItemText>
        </>
      ) : (
        <>
          <ListItemText className={classes.value} primary={id.service} />
          <ListItemText className={classes.value} primary={id.value} />
        </>
      )}
      <ListItemSecondaryAction>
        {onEdit ? (
          <>
            <IconButton aria-label="cancel" onClick={handleCancelClick}>
              <CancelIcon color="action" />
            </IconButton>
            <IconButton aria-label="save" onClick={handleSaveClick}>
              <SaveIcon color="secondary" />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton aria-label="edit" onClick={handleEditClick}>
              <EditIcon color="primary" />
            </IconButton>
            <IconButton aria-label="delete" onClick={handleDeleteClick}>
              <DeleteIcon color="error" />
            </IconButton>
          </>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  )
}
