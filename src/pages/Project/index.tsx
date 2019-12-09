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
import { ProjectInfoTab, Project } from './ProjectInfoTab'
import { SettingsTab } from './SettingsTab'
import { useAsyncEffect } from '../../utils/use-async-effect'
import { PROJECTS } from '../../constants/db.collections'
import { MembersTab } from './MembersTab'
import { DocumentsTab } from './DocumentsTab'
import { useSnackbar } from 'notistack'

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
  { label: 'Settings', index: 3, child: <SettingsTab /> },
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
  owner: '',
  members: [],
}

export const ProjectContext = createContext<{
  project: Project
  loading: boolean
}>({
  project: { ...INIT_PROJECT },
  loading: true,
})

export const ProjectPage = () => {
  const [tabIndex, setTabIndex] = React.useState<number>(0)
  const { firestore }: Auth = useAuth()
  const { code } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const history = useHistory()
  const [loading, setLoading] = useState<boolean>(true)
  const [project, setProject] = useState<Project>({ ...INIT_PROJECT })

  const handleChange = (event: React.ChangeEvent<{}>, newIndex: number) => {
    setTabIndex(newIndex)
  }

  const reloadProject = async () => {
    try {
      setLoading(true)
      const doc = await firestore
        .collection(PROJECTS)
        .doc(code)
        .get()
      const newProject = doc.data() as Project
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
    <ProjectContext.Provider value={{ project, loading }}>
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
