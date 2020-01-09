import React, { FC, useState } from 'react'
import { IdGroup } from './MembersTab'
import {
  createStyles,
  makeStyles,
  Theme,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  IconButton,
  Box,
  Tooltip,
} from '@material-ui/core'
import { FileCopy as FileCopyIcon } from '@material-ui/icons'
import TableContainer from '@material-ui/core/TableContainer'
import { Loading } from '../../components/Loading'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cell: {
      textAlign: 'center',
    },
    title: {
      backgroundColor: theme.palette.grey['100'],
    },
    idCell: {
      textAlign: 'center',
      width: '50%',
    },
  })
)

export const SortedIdTable: FC<{
  idGroups: IdGroup[]
  loading: boolean
}> = props => {
  const classes = useStyles()

  if (props.loading) {
    return <Loading />
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className={classes.title}>
            <TableCell className={classes.cell}>Service Name</TableCell>
            <TableCell className={classes.cell}>Count</TableCell>
            <TableCell className={classes.cell}>Member ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.idGroups.map((group, i) => (
            <TableRow key={`${group.service}-${i}`}>
              <TableCell className={classes.cell}>{group.service}</TableCell>
              <TableCell className={classes.cell}>{group.count}</TableCell>
              <TableCell className={classes.cell}>
                <IdsTable group={group} />
              </TableCell>
            </TableRow>
          ))}
          {props.idGroups.length === 0 && (
            <TableRow>
              <TableCell className={classes.cell} colSpan={3}>
                No Data...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const IdsTable: FC<{ group: IdGroup }> = props => {
  const INIT_COPY_MESSAGE = 'Copy to Clipboard'
  const [copyMessage, setCopyMessage] = useState(INIT_COPY_MESSAGE)
  const handleCopyClick = (value: string) => {
    navigator.clipboard.writeText(value)
    setCopyMessage(`"${value}" copied!`)
  }

  const classes = useStyles()
  return (
    <TableContainer>
      <Table size="small" padding="none">
        <TableHead>
          <TableRow className={classes.title}>
            <TableCell className={classes.idCell}>Member email</TableCell>
            <TableCell className={classes.idCell}>Service ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.group.emails.map((email, i) => (
            <TableRow key={`${email}-${i}`}>
              <TableCell className={classes.idCell}>{email}</TableCell>
              <TableCell className={classes.idCell}>
                {props.group.values[i]}
                <Box component="span" ml={1}>
                  <Tooltip title={copyMessage}>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleCopyClick(props.group.values[i])}
                      onMouseLeave={() => setCopyMessage(INIT_COPY_MESSAGE)}
                    >
                      <FileCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
