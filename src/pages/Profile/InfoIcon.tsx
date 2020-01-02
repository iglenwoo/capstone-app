import { default as React, FC } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { InfoOutlined as InfoOutlinedIcon } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    infoIcon: {
      color: theme.palette.info.dark,
    },
  })
)

export const InfoIcon: FC = () => {
  const classes = useStyles()

  return <InfoOutlinedIcon fontSize="small" className={classes.infoIcon} />
}
