import * as React from 'react'
import { Link as LinkUI, Container } from '@material-ui/core'
import { Create } from './Create'
import { Link } from 'react-router-dom'
import * as routes from '../../constants/routes'

export const Projects = () => {
  return (
    <Container component="main" maxWidth="lg">
      <Create />
      <LinkUI
        href="#"
        variant="body2"
        component={Link}
        to={`${routes.PROJECTS}/t1`}
      >
        project t1
      </LinkUI>
    </Container>
  )
}
