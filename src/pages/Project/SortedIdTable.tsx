import React, { FC } from 'react'
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
  Button,
} from '@material-ui/core'
import TableContainer from '@material-ui/core/TableContainer'

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

export const SortedIdTable: FC<{
  idGroups: IdGroup[]
}> = props => {
  const classes = useStyles()

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
              <TableCell>No Data...</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const IdsTable: FC<{ group: IdGroup }> = props => {
  const handleCopyClick = (value: string) => {
    navigator.clipboard.writeText(value)
  }

  const classes = useStyles()
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className={classes.title}>
            <TableCell className={classes.cell}>Member email</TableCell>
            <TableCell className={classes.cell} colSpan={2}>
              Service ID
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.group.emails.map((email, i) => (
            <TableRow key={`${email}-${i}`}>
              <TableCell className={classes.cell}>{email}</TableCell>
              <TableCell align="right">{props.group.values[i]}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleCopyClick(props.group.values[i])}
                >
                  Copy to Clipboard
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
