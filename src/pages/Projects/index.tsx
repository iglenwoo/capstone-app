import * as React from 'react'
import { Container } from '@material-ui/core'
import { Create } from './Create'
import { Join } from './Join'

export const Projects = () => {
  return (
    <Container component="main" maxWidth="lg">
      <Create />
      <Join />
    </Container>
  )
}
