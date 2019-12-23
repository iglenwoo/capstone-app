import React, { SyntheticEvent, useContext, useEffect, useState } from 'react'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import {
  Box,
  Button,
  Card,
  CardContent,
  createStyles,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import { IDS, PROJECTS, USERS } from '../../constants/db.collections'
import { ProjectsContext } from './index'
import { Loading } from '../../components/Loading'
import { EmptyListItem } from './ProjectList'
import { useAsyncEffect } from '../../utils/use-async-effect'
import { IDs } from '../Project/MembersTab'
import { Project } from '../Project/model'
import { useSnackbar } from 'notistack'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
    listItem: {
      '&:hover': {
        // backgroundColor: theme.palette.grey['200'],
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      },
    },
    listItemText: {
      marginLeft: theme.spacing(2),
    },
  })
)

export const Invitations = () => {
  const classes = useStyles()
  const { fetchProjects } = useContext(ProjectsContext)
  const { functions }: Auth = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [projects, setProjects] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchInvitations = async () => {
    setLoading(true)

    try {
      const res = await functions.httpsCallable('getInvitations')()
      console.log(res)
      const invitedProjects = res.data.map((project: Project) => {
        return project.code
      })
      setProjects(invitedProjects)
    } catch (e) {
      console.log('Error getting invitation document:', e)
    } finally {
      setLoading(false)
    }
  }
  useAsyncEffect(fetchInvitations, [])

  const handleAcceptClick = async (code: string) => {
    setLoading(true)

    try {
      await functions.httpsCallable('acceptInvitation')({ code })
      await fetchInvitations()
      fetchProjects()
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
      console.log('Error getting invitation document:', e)
    } finally {
      setLoading(false)
    }
  }

  const projectsLinks = projects.length ? (
    projects.map((p, i) => {
      return (
        <ListItem key={`${p}-${i}`} className={classes.listItem} dense>
          <ListItemText>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                handleAcceptClick(p)
              }}
            >
              Accept
            </Button>
            <Typography display="inline" className={classes.listItemText}>
              {p}
            </Typography>
          </ListItemText>
        </ListItem>
      )
    })
  ) : (
    <EmptyListItem />
  )

  return (
    <Card className={classes.card}>
      <CardContent>
        {loading ? (
          <Loading />
        ) : (
          <Box py={1}>
            <Typography gutterBottom variant="h6">
              Invitations to me
            </Typography>
            <List dense>{projectsLinks}</List>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
