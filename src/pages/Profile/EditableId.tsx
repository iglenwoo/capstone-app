import {
  default as React,
  FC,
  SyntheticEvent,
  useContext,
  useState,
} from 'react'
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
import { Id } from './Ids'
import { IdContext } from './Ids'

export const EditableId: FC<{
  id: Id
  index: number
}> = props => {
  const { handleRemoveId, handleSaveId } = useContext(IdContext)
  const [onEdit, setOnEdit] = useState(false)
  const [id, setId] = useState<Id>(props.id)

  const handleCancelClick = (e: SyntheticEvent) => {
    setId(props.id)
    setOnEdit(false)
  }
  const handleSaveClick = (e: SyntheticEvent) => {
    handleSaveId(props.index, id)
    setOnEdit(false)
  }
  const handleEditClick = (e: SyntheticEvent) => {
    setOnEdit(true)
  }
  const handleDeleteClick = (e: SyntheticEvent) => {
    handleRemoveId(props.index)
  }

  return (
    <ListItem>
      {onEdit ? (
        <>
          <ListItemText>
            <TextField
              required
              fullWidth
              value={id.service}
              onChange={e =>
                setId({
                  ...id,
                  service: e.currentTarget.value,
                })
              }
            />
          </ListItemText>
          <ListItemText>
            <TextField
              required
              fullWidth
              value={id.value}
              onChange={e =>
                setId({
                  ...id,
                  value: e.currentTarget.value,
                })
              }
            />
          </ListItemText>
        </>
      ) : (
        <>
          <ListItemText primary={id.service} />
          <ListItemText primary={id.value} />
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
