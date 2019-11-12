import {
  FC,
  default as React,
  useState,
  SyntheticEvent,
  createContext,
  useEffect,
} from 'react'
import {
  Card,
  CardContent,
  createStyles,
  Divider,
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
import { AddCircle as AddCircleIcon } from '@material-ui/icons'
import { EditableId } from './EditableId'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'

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

export const IdContext = createContext<{
  handleRemoveId: (index: number) => void
}>({
  handleRemoveId: () => {},
})

export interface Id {
  service: string
  value: string
}

const INIT_ID: Id = {
  service: '',
  value: '',
}

export const Ids: FC<{}> = props => {
  const { user, firestore }: Auth = useAuth()
  const [ids, setIds] = useState<Id[]>([])
  const [newId, setNewId] = useState<Id>({ ...INIT_ID })

  useEffect(() => {
    if (user === null) return

    firestore
      .collection('ids')
      .doc(user.uid)
      .get()
      .then(doc => {
        const data = doc.data()
        if (data && data.ids) {
          setIds(data.ids)
        }
      })
      .catch(error => {
        console.log('Error getting cached document:', error)
      })
  }, [])

  const handleRemoveId = (index: number) => {
    const newIds = ids.filter(id => id.value !== ids[index].value)
    setIds(newIds)
  }

  const handleAddId = (e: SyntheticEvent) => {
    e.preventDefault()

    if (!newId.service) {
      alert('Please type a service')
      return
    }
    if (!newId.value) {
      alert('Please type an account value')
      return
    }
    if (
      ids.some(id => id.service.toLowerCase() === newId.service.toLowerCase())
    ) {
      alert(`Service [${newId.service}] already exists`)
      return
    }

    setIds([...ids, newId])
    //TODO: Save (1. convert to json, 2. store to Firestore)

    setNewId({ ...INIT_ID })
  }

  const classes = useStyles()

  return (
    <IdContext.Provider value={{ handleRemoveId }}>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            IDs
          </Typography>
          <List>
            <ListItem>
              <ListItemText secondary="Service" />
              <ListItemText secondary="Account" />
              <ListItemSecondaryAction />
            </ListItem>
            {ids.length ? (
              ids.map((id, index) => (
                <EditableId
                  id={id}
                  index={index}
                  key={`${id.service}.${index}`}
                />
              ))
            ) : (
              <>
                <Divider />
                <ListItem>
                  <ListItemText primary="Please add your IDs." />
                </ListItem>
              </>
            )}
            <ListItem>
              <ListItemText>
                <TextField
                  required
                  id="standard-required"
                  label="Service"
                  placeholder="Service name"
                  fullWidth
                  value={newId.service}
                  onChange={e =>
                    setNewId({ ...newId, service: e.currentTarget.value })
                  }
                />
              </ListItemText>
              <ListItemText>
                <TextField
                  required
                  id="standard-required"
                  label="Id"
                  placeholder="account"
                  fullWidth
                  value={newId.value}
                  onChange={e =>
                    setNewId({ ...newId, value: e.currentTarget.value })
                  }
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
          </List>
        </CardContent>
      </Card>
    </IdContext.Provider>
  )
}
