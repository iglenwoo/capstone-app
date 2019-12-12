import React, { FC } from 'react'
import {
  Chip,
  createStyles,
  makeStyles,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { CountableGroup } from './MembersTab'

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

export const SortedSkillChips: FC<{
  groups: CountableGroup[]
}> = props => {
  const classes = useStyles()

  return (
    <>
      {props.groups.map((g, i) => (
        <Tooltip
          key={`${g.name}-${i}`}
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
                <Typography variant="body1">{g.name}</Typography>
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
