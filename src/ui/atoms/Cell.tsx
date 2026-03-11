import './Cell.css'

interface CellProps {
  isLit: boolean
  onClick: () => void
  row: number
  col: number
}

export function Cell({ isLit, onClick, row, col }: CellProps) {
  return (
    <button
      className={`cell ${isLit ? 'lit' : 'unlit'}`}
      onClick={onClick}
      aria-label={`Cell ${row}, ${col} - ${isLit ? 'on' : 'off'}`}
      title={`Row ${row + 1}, Col ${col + 1}`}
    />
  )
}
