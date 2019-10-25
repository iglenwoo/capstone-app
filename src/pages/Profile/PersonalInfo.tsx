import { FC, default as React, useState, SyntheticEvent } from 'react'
import {
  Card,
  CardActions,
  CardContent,
  createStyles,
  Fab,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core'
import {
  Edit as EditIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
} from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      minWidth: 275,
    },
    title: {
      fontSize: 14,
    },
    fab: {
      margin: theme.spacing(1),
    },
    paper: {
      padding: theme.spacing(2),
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
          <Grid container spacing={3}>
            {ids.map(id => (
              <>
                <Grid item xs={12} sm={6}>
                  <Paper className={classes.paper}>{id.service}</Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper className={classes.paper}>{id.value}</Paper>
                </Grid>
              </>
            ))}
          </Grid>
        ) : (
          <p>Please add your IDs.</p>
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
