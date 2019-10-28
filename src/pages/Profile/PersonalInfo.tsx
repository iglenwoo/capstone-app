import { FC, default as React, useState, SyntheticEvent, Fragment } from 'react'
import {
  Card,
  CardActions,
  CardContent,
  createStyles,
  Divider,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core'
import {
  Edit as EditIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  RemoveCircle as RemoveCircleIcon,
  AddCircle as AddCircleIcon,
} from '@material-ui/icons'
import { Id } from './index'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      minWidth: 275,
    },
    fab: {
      margin: theme.spacing(1),
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  })
)

export const PersonalInfo: FC<{
  ids: Id[]
}> = props => {
  const [ids, setIds] = useState<Id[]>(props.ids)
  const [onEdit, setOnEdit] = useState(false)
  const [newService, setNewService] = useState('')
  const [newId, setNewId] = useState('')

  //TODO: fetch ids

  const handleCancel = (event: SyntheticEvent) => {
    event.preventDefault()
    setIds(props.ids)
    setOnEdit(false)
  }
  const handleEdit = (event: SyntheticEvent) => {
    event.preventDefault()
    setOnEdit(!onEdit)
  }

  const handleRemoveItem = (index: number) => {
    const newIds = ids.filter(id => id.value !== ids[index].value)
    setIds(newIds)
  }

  const handleAddId = (e: SyntheticEvent) => {
    e.preventDefault()

    if (!newService) {
      alert('Please type a service')
      return
    }
    if (!newId) {
      alert('Please type an account value')
      return
    }
    if (ids.some(id => id.service.toLowerCase() === newService.toLowerCase())) {
      alert(`Service [${newService}] already exists`)
      return
    }

    const newIds = [...props.ids]
    newIds.push({
      service: newService,
      value: newId,
    })
    setIds(newIds)
    setNewService('')
    setNewId('')
  }

  //TODO: Save (1. convert to json, 2. store to Firestore)
  const handleSave = (e: SyntheticEvent) => {
    e.preventDefault()
  }

  const classes = useStyles()

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          IDs
        </Typography>
        <List>
          {ids.length ? (
            ids.map((id, index) => (
              <Fragment key={`${id.service}.${index}`}>
                <Divider />
                <ListItem>
                  {onEdit ? (
                    <>
                      <ListItemText primary={id.service} />
                      <ListItemText primary={id.value} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => {
                            handleRemoveItem(index)
                          }}
                        >
                          <RemoveCircleIcon color="secondary" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </>
                  ) : (
                    <>
                      <ListItemText primary={id.service} />
                      <ListItemText primary={id.value} />
                    </>
                  )}
                </ListItem>
              </Fragment>
            ))
          ) : (
            <>
              <Divider />
              <ListItem>
                <ListItemText primary="Please add your IDs." />
              </ListItem>
            </>
          )}
          <Divider />
          {onEdit && (
            <ListItem>
              <ListItemText>
                <TextField
                  required
                  id="standard-required"
                  label="Service"
                  placeholder="Service name"
                  fullWidth
                  value={newService}
                  onChange={e => setNewService(e.currentTarget.value)}
                />
              </ListItemText>
              <ListItemText>
                <TextField
                  required
                  id="standard-required"
                  label="Id"
                  placeholder="account"
                  fullWidth
                  value={newId}
                  onChange={e => setNewId(e.currentTarget.value)}
                />
              </ListItemText>
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="add"
                  color="primary"
                  onClick={handleAddId}
                >
                  <AddCircleIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )}
        </List>
      </CardContent>
      <CardActions>
        {onEdit ? (
          <>
            <Fab
              color="default"
              size="small"
              aria-label="cancel"
              className={classes.fab}
              onClick={handleCancel}
            >
              <CancelIcon />
            </Fab>
            <Fab
              color="primary"
              size="small"
              aria-label="save"
              className={classes.fab}
              onClick={handleSave}
            >
              <SaveIcon />
            </Fab>
          </>
        ) : (
          <Fab
            color="secondary"
            size="small"
            aria-label="edit"
            className={classes.fab}
            onClick={handleEdit}
          >
            <EditIcon />
          </Fab>
        )}
      </CardActions>
    </Card>
  )
}
