import React, { FC } from 'react'
import { CountableGroup } from './MembersTab'
import {
  createStyles,
  makeStyles,
  Theme,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from '@material-ui/core'
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
  })
)

export const SortedItemTable: FC<{
  groups: CountableGroup[]
  itemTitle: string
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
            <TableCell className={classes.cell}>{props.itemTitle}</TableCell>
            <TableCell className={classes.cell}>Count</TableCell>
            <TableCell className={classes.cell}>Member Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.groups.map((g, i) => (
            <TableRow key={`${g.name}-${i}`}>
              <TableCell className={classes.cell}>{g.name}</TableCell>
              <TableCell className={classes.cell}>{g.count}</TableCell>
              <TableCell className={classes.cell}>
                <EmailTable group={g} />
              </TableCell>
            </TableRow>
          ))}
          {props.groups.length === 0 && (
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

const EmailTable: FC<{ group: CountableGroup }> = props => {
  const classes = useStyles()
  return (
    <TableContainer>
      <Table size="small" padding="none">
        <TableBody>
          {props.group.emails.map((email, i) => (
            <TableRow key={`${email}-${i}`}>
              <TableCell
                className={classes.cell}
              >{`${props.group.firstNames[i]} ${props.group.lastNames[i]}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
