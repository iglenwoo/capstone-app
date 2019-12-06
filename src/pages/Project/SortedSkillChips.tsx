import React, { FC } from 'react'
import {
  Chip,
  createStyles,
  makeStyles,
  Theme,
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
        <Chip
          key={`${g.name}-${i}`}
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
      ))}
    </>
  )
}
