import { FC, default as React, useState, SyntheticEvent } from 'react'
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
  DeleteForever as DeleteForeverIcon,
  Add as AddIcon,
} from '@material-ui/icons'

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

interface Id {
  service: string
  value: string
}

export const PersonalInfo: FC = () => {
  const mockIds: Id[] = [
    { service: 'Github', value: 'github-id' },
    { service: 'Trello', value: 'trello-id' },
    { service: 'WhatsApp', value: 'whatsapp-id' },
  ]
  const [ids, setIds] = useState<Id[]>(mockIds)
  const [onEdit, setOnEdit] = useState(false)

  //TODO: fetch ids

  //TODO: edit ids

  //TODO: add new ids

  const handleCancel = (event: SyntheticEvent) => {
    event.preventDefault()
    setOnEdit(false)
  }
  const handleEdit = (event: SyntheticEvent) => {
    event.preventDefault()
    setOnEdit(!onEdit)
  }

  const classes = useStyles()

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          IDs
        </Typography>
        {ids.length ? (
          <List>
            {ids.map(id => (
              <>
                <Divider />
                <ListItem key={id.service}>
                  {onEdit ? (
                    <>
                      <ListItemText primary={id.service} />
                      <ListItemText primary={id.value} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete">
                          <DeleteForeverIcon color="secondary" />
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
              </>
            ))}
          </List>
        ) : (
          <p>Please add your IDs.</p>
        )}
        {onEdit && (
          <form noValidate autoComplete="off">
            <Divider />
            <TextField
              required
              id="standard-required"
              label="Required"
              placeholder="Service name e.g. Github"
              margin="normal"
              variant="filled"
            />
            <TextField
              required
              id="standard-required"
              label="Required"
              placeholder="id"
              margin="normal"
              variant="filled"
            />
            <Fab
              color="primary"
              aria-label="add"
              size="small"
              className={classes.fab}
            >
              <AddIcon />
            </Fab>
          </form>
        )}
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
