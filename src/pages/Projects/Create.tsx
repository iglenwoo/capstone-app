import {
  Box,
  Button,
  Card,
  CardContent,
  createStyles,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core'
import * as React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(2),
    },
    fieldContainer: {
      display: 'flex',
      justifyContext: 'center',
      alignItems: 'top',
      flexWrap: 'wrap',
    },
    button: {
      minWidth: 150,
      marginLeft: theme.spacing(1),
    },
  })
)

export const Create = () => {
  const classes = useStyles()

  return (
    <Card className={classes.card}>
      <CardContent>
        <Box className={classes.fieldContainer} mb={2}>
          <Box flexGrow={2} mx={1}>
            <TextField
              id="project-code"
              label="Project Code"
              placeholder="Capstone-Project"
              helperText="Project Unique code (no white spaces)"
              margin="dense"
              variant="outlined"
              fullWidth
            />
          </Box>
          <Box flexGrow={2} mx={1}>
            <TextField
              id="project-password"
              label="Password"
              type="password"
              helperText="Password (no white spaces, at least 8 characters)"
              margin="dense"
              variant="outlined"
              fullWidth
            />
          </Box>
          <Box mx={1} pt={1}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
            >
              Create
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
