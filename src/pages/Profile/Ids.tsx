import { FC, default as React, useState, createContext, useEffect } from 'react'
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
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { AddCircle as AddCircleIcon } from '@material-ui/icons'
import { EditableId } from './EditableId'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import { IDS } from '../../constants/db.collections'
import { Loading } from '../../components/Loading'
import { InfoIcon } from './InfoIcon'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(1),
    },
    title: {
      backgroundColor: theme.palette.grey['100'],
    },
    value: {
      width: '100%',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(2),
    },
  })
)

export const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 350,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip)

export const IdContext = createContext<{
  handleSaveId: (index: number, newId: Id, cb: () => void) => void
  handleRemoveId: (index: number) => void
}>({
  handleSaveId: () => {},
  handleRemoveId: () => {},
})

export interface Id {
  service: string
  value: string
  email: string
}

const INIT_ID: Id = {
  service: '',
  value: '',
  email: '',
}

export const Ids: FC = () => {
  const { user, firestore }: Auth = useAuth()
  const [loading, setLoading] = useState(true)
  const [ids, setIds] = useState<Id[]>([])
  const [newId, setNewId] = useState<Id>({ ...INIT_ID })

  useEffect(() => {
    if (!user || !user.email) return

    firestore
      .collection(IDS)
      .doc(user.email)
      .get()
      .then(doc => {
        const data = doc.data()
        if (data && data.ids) {
          setIds(data.ids)
        }
      })
      .catch(error => {
        console.log('Error getting document:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [user, firestore])

  const handleRemoveId = (index: number) => {
    const newIds = ids.filter(id => id.value !== ids[index].value)
    setNewIds(newIds, () => {
      setIds(newIds)
    })
  }

  const isIdEmpty = (_newId: Id) => {
    if (!_newId.service) {
      alert('Please type a service')
      return true
    }
    if (!_newId.value) {
      alert('Please type an account value')
      return true
    }

    return false
  }

  const handleSaveId = (index: number, newId: Id, cb: () => void) => {
    if (isIdEmpty(newId)) return

    let duplicated = false
    ids.forEach((id, i) => {
      if (index !== i && id.service === newId.service) {
        duplicated = true
      }
    })

    if (duplicated) {
      alert(
        `Service "${newId.service}" already exists.\nMultiple account for a service is not supported at this moment.`
      )
      return false
    }

    const newIds = ids.map((id, i) => (index === i ? newId : id))
    setNewIds(newIds, () => {
      setIds(newIds)
      cb()
    })
  }

  const _addId = () => {
    if (isIdEmpty(newId)) return

    if (
      ids.some(id => id.service.toLowerCase() === newId.service.toLowerCase())
    ) {
      alert(
        `Service "${newId.service}" already exists.\nMultiple account for a service is not supported at this moment.`
      )
      return false
    }

    const newIds = [...ids, newId]
    setNewIds(newIds, () => {
      setIds(newIds)
      setNewId({ ...INIT_ID })
    })
  }

  const handleEnterToSave = (e: any) => {
    if (e.key === 'Enter') {
      _addId()
    }
  }

  const handleAddId = () => {
    _addId()
  }

  const setNewIds = (newIds: Id[], cb: () => void) => {
    if (!user || !user.email) return

    setLoading(true)
    const objs = newIds.map(obj => {
      return Object.assign({}, obj)
    })
    firestore
      .collection(IDS)
      .doc(user.email)
      .set({ ids: objs, email: user.email })
      .then(() => {
        setIds(newIds)
        cb()
        setNewId({ ...INIT_ID })
      })
      .catch(error => {
        console.log('Error updating document:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const classes = useStyles()

  return (
    <IdContext.Provider value={{ handleRemoveId, handleSaveId }}>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" display="inline" gutterBottom>
            Service Accounts
            <HtmlTooltip placement="right-start" title={renderTitle()}>
              <Typography display="inline">
                <InfoIcon />
              </Typography>
            </HtmlTooltip>
          </Typography>
          {loading ? (
            <Loading />
          ) : (
            <List dense>
              <ListItem className={classes.title} divider>
                <ListItemText primary="Service" />
                <ListItemText primary="Account" />
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
                <ListItemText className={classes.value}>
                  <Autocomplete
                    freeSolo
                    autoHighlight
                    autoSelect
                    options={serviceOptions}
                    value={newId.service}
                    onChange={(e, newValue) => {
                      if (newValue) {
                        setNewId({ ...newId, service: newValue })
                      }
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant="outlined"
                        margin="dense"
                        label="Service Name"
                        placeholder="Github"
                        fullWidth
                        onBlur={e => {
                          setNewId({ ...newId, service: e.currentTarget.value })
                        }}
                      />
                    )}
                  />
                </ListItemText>
                <ListItemText className={classes.value}>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    label="Account (ID)"
                    placeholder="example"
                    fullWidth
                    value={newId.value}
                    onChange={e =>
                      setNewId({ ...newId, value: e.currentTarget.value })
                    }
                    onKeyPress={handleEnterToSave}
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
          )}
        </CardContent>
      </Card>
    </IdContext.Provider>
  )
}

const renderTitle = () => (
  <>
    <Typography color="inherit">Service Accounts:</Typography>
    <b>Add your service accounts here.</b>
    <br />
    <i>e.g. Github, Slack, LinkedIn, Facebook, Google, OSU, ...</i>
    <br />
    This will help you to share them with other team members in a project.
  </>
)

export const serviceOptions = [
  'Facebook',
  'Github',
  'Gitlab',
  'Gmail',
  'Instagram',
  'Line',
  'LinkedIn',
  'Outlook',
  'Skype',
  'SnapChat',
  'Telegram',
  'TikTok',
  'Trello',
  'Twitter',
  'WeChat',
  'WhatsApp',
]
