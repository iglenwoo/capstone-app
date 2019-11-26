import React, { useEffect, useState, createContext } from 'react'
import { useParams } from 'react-router'
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
import { ProjectInfo, Project } from './ProjectInfo'
import { Settings } from './Settings'

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
  { label: 'Info', index: 0, child: <ProjectInfo /> },
  { label: 'Documents', index: 1, child: <div>Documents</div> }, // TODO
  { label: 'Settings', index: 3, child: <Settings /> }, // TODO
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
  const { user, firestore }: Auth = useAuth()
  const { code } = useParams()
  const [loading, setLoading] = useState<boolean>(true)
  const [project, setProject] = useState<Project>({ ...INIT_PROJECT })

  useEffect(() => {
    if (user === null) return

    firestore
      .collection('projects')
      .doc(code)
      .get()
      .then(doc => {
        const data = doc.data()
        setProject(data as Project)
        setLoading(false)
      })
      .catch(error => {
        console.log('Error getting document:', error)
        setLoading(false)
      })
  }, [code, user, firestore])

  const handleChange = (event: React.ChangeEvent<{}>, newIndex: number) => {
    setTabIndex(newIndex)
  }

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