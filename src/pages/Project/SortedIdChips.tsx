import React, { FC } from 'react'
import {
  Box,
  Chip,
  createStyles,
  makeStyles,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { IdGroup } from './MembersTab'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chip: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
    chipCount: {
      marginLeft: theme.spacing(1),
    },
  })
)

export const SortedIdChips: FC<{
  idGroups: IdGroup[]
}> = props => {
  const classes = useStyles()

  return (
    <>
      {props.idGroups.map((g, i) => (
        <Tooltip
          key={`${g.service}-${i}`}
          title={
            <>
              {g.emails.map((e, j) => (
                <Typography key={`${e}-${j}`}>{e}</Typography>
              ))}
            </>
          }
        >
          <Chip
            className={classes.chip}
            label={
              <>
                <Typography variant="body1">{g.service}</Typography>
                <Typography variant="body1" className={classes.chipCount}>
                  {g.count}
                </Typography>
              </>
            }
          />
        </Tooltip>
      ))}
    </>
  )
}
