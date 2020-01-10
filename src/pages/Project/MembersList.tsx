import React, { FC, useEffect, useState } from 'react'
import {
  Box,
  createStyles,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Tooltip,
  Typography,
  TypographyProps,
} from '@material-ui/core'
import { Members, MemberStatus } from './model'
import { useAuth } from '../../components/FirebaseAuth/use-auth'
import TableContainer from '@material-ui/core/TableContainer'
import { FileCopy as FileCopyIcon } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cell: {
      textAlign: 'center',
    },
    title: {
      backgroundColor: theme.palette.grey['100'],
    },
  })
)

export const MembersList: FC<{
  title?: string
  members: Members
}> = props => {
  const classes = useStyles()
  const { user } = useAuth()
  const [myEmail, setMyEmail] = useState('')
  const INIT_COPY_MESSAGE = 'Copy to Clipboard'
  const [copyMessage, setCopyMessage] = useState(INIT_COPY_MESSAGE)

  useEffect(() => {
    if (user && user.email) {
      setMyEmail(user.email)
    }
  }, [user])

  const getStatusColor = (status: MemberStatus) => {
    let color: TypographyProps['color'] = 'inherit'
    switch (status) {
      case MemberStatus.Accepted:
        color = 'primary'
        break
      case MemberStatus.Invited:
        color = 'secondary'
        break
      case MemberStatus.Own:
        break
      default:
    }
    return color
  }

  const handleCopyClick = (value: string) => {
    navigator.clipboard.writeText(value)
    setCopyMessage(`"${value}" copied!`)
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className={classes.title}>
            <TableCell className={classes.cell}>Name</TableCell>
            <TableCell className={classes.cell}>Email</TableCell>
            <TableCell className={classes.cell}>Role</TableCell>
            <TableCell className={classes.cell}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(props.members).map((email, i) => (
            <TableRow key={`${email}-${i}`}>
              <TableCell className={classes.cell}>
                {`${props.members[email].firstName} ${props.members[email].lastName}`}
                {email === myEmail && ' (me)'}
              </TableCell>
              <TableCell className={classes.cell}>
                {email}
                <Box component="span" ml={1}>
                  <Tooltip title={copyMessage}>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleCopyClick(email)}
                      onMouseLeave={() => setCopyMessage(INIT_COPY_MESSAGE)}
                    >
                      <FileCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell className={classes.cell}>
                {props.members[email].role}
              </TableCell>
              <TableCell className={classes.cell}>
                <Typography
                  variant="body2"
                  color={getStatusColor(props.members[email].status)}
                >
                  {props.members[email].status}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
          {Object.keys(props.members).length === 0 && (
            <TableRow>
              <TableCell className={classes.cell} colSpan={4}>
                No Member...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
