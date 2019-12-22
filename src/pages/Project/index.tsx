import React, { useState, createContext } from 'react'
import { useHistory, useParams } from 'react-router'
import {
  Card,
  CardContent,
  Container,
  createStyles,
  makeStyles,
  Tab,
  Tabs,
  Theme,
  Typography,
} from '@material-ui/core'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import { ProjectInfoTab } from './ProjectInfoTab'
import { useAsyncEffect } from '../../utils/use-async-effect'
import { PROJECTS } from '../../constants/db.collections'
import { MembersTab } from './MembersTab'
import { DocumentsTab } from './DocumentsTab'
import { useSnackbar } from 'notistack'
import { MemberRole, Project } from './model'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(1),
    },
    cardContent: {
      '&:last-child': {
        paddingBottom: theme.spacing(2),
      },
    },
  })
)

interface TabPanelProps {
  children?: React.ReactNode
  index: any
  value: any
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  const classes = useStyles()

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>{children}</CardContent>
      </Card>
    </Typography>
  )
}

const a11yProps = (index: number) => {
  return {
    id: `project-tab-${index}`,
    'aria-controls': `project-tabpanel-${index}`,
  }
}

const tabs = [
  { label: 'Info', index: 0, child: <ProjectInfoTab /> },
  { label: 'Members', index: 1, child: <MembersTab /> },
  { label: 'Documents', index: 2, child: <DocumentsTab /> },
]
const tabItems = tabs.map(tab => (
  <Tab
    value={tab.index}
    label={tab.label}
    {...a11yProps(tab.index)}
    key={`tab-${tab.index}`}
  />
))

const INIT_PROJECT: Project = {
  code: '',
  members: [],
  title: '',
  desc: '',
  isOwned: false,
}

export const ProjectContext = createContext<{
  project: Project
  loading: boolean
  reloadProject: () => void
}>({
  project: { ...INIT_PROJECT },
  loading: true,
  reloadProject: () => {},
})

export const ProjectPage = () => {
  const { functions, user }: Auth = useAuth()
  const { code } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const history = useHistory()
  const [tabIndex, setTabIndex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [project, setProject] = useState<Project>({ ...INIT_PROJECT })

  const handleChange = (event: React.ChangeEvent<{}>, newIndex: number) => {
    setTabIndex(newIndex)
  }

  const setIsOwnerOf = (project: Project) => {
    for (const member of project.members) {
      if (
        user &&
        user.email === member.email &&
        member.role === MemberRole.Owner
      ) {
        project.isOwned = true
        return
      }
    }
    project.isOwned = false
  }

  const reloadProject = async () => {
    try {
      setLoading(true)
      const readProject = functions.httpsCallable('readProject')
      const doc = await readProject({ code })
      const newProject = doc.data as Project
      setIsOwnerOf(newProject)
      setProject({ ...newProject })

      setLoading(false)
    } catch (e) {
      if (e.message === 'Missing or insufficient permissions.') {
        enqueueSnackbar(
          `You are not a member of project '${code}'\nYou will be redirected to the previous page in 3 seconds.`,
          {
            variant: 'error',
          }
        )
      }
      console.log('Error getting document:', e)
      setTimeout(() => {
        history.goBack()
      }, 3000)
    }
  }

  useAsyncEffect(reloadProject, [])

  const tabPanels = tabs.map(tab => {
    return (
      <TabPanel
        value={tabIndex}
        index={tab.index}
        key={`tabpanel-${tab.index}`}
      >
        {tab.child}
      </TabPanel>
    )
  })

  return (
    <ProjectContext.Provider value={{ project, loading, reloadProject }}>
      <Container component="main" maxWidth="lg">
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          {tabItems}
        </Tabs>
        {tabPanels}
      </Container>
    </ProjectContext.Provider>
  )
}
