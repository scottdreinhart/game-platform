import styles from './BoardCell.module.css'

interface BoardCellProps {
  number: number
  marked: boolean
  selected: boolean
  highlighted: boolean
  disabled: boolean
  onClick: () => void
}

export function BoardCell({
  number,
  marked,
  selected,
  highlighted,
  disabled,
  onClick,
}: BoardCellProps) {
  const classes: string[] = [styles.cell]

  if (marked) {
    classes.push(styles.marked)
  }

  if (selected) {
    classes.push(styles.selected)
  }

  if (highlighted) {
    classes.push(styles.hint)
  }

  if (disabled) {
    classes.push(styles.disabled)
  }

  return (
    <button
      type="button"
      className={classes.join(' ')}
      onClick={onClick}
      disabled={disabled}
      aria-label={`bingo-cell-${number}`}
    >
      {number}
    </button>
  )
}
