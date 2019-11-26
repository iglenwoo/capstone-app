import { default as React, FC, SyntheticEvent } from 'react'
import { Box, Chip } from '@material-ui/core'

export const EditableChips: FC<{
  chips: string[]
  editingChips: string[]
  onDelete: (e: SyntheticEvent, chipToDelete: string) => void
  editing: boolean
}> = props => {
  return (
    <Box display="flex" flexWrap="wrap">
      {props.editing
        ? props.editingChips.map((s, i) => (
            <Box display="inline" mt={1} ml={1} key={`${s}-${i}`}>
              <Chip
                label={s}
                onDelete={e => {
                  props.onDelete(e, s)
                }}
              />
            </Box>
          ))
        : props.chips.map((c, i) => (
            <Box display="inline" mt={1} ml={1} key={`${c}-${i}`}>
              {props.editing ? (
                <Chip
                  label={c}
                  onDelete={e => {
                    props.onDelete(e, c)
                  }}
                />
              ) : (
                <Chip key={`${c}-${i}`} label={c} />
              )}
            </Box>
          ))}
    </Box>
  )
}
