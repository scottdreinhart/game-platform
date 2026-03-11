import { Board } from '@/domain'
import { Cell } from '@/ui/atoms'
import './GameBoard.css'

interface GameBoardProps {
  board: Board
  onCellClick: (row: number, col: number) => void
}

export function GameBoard({ board, onCellClick }: GameBoardProps) {
  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((isLit, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              isLit={isLit}
              onClick={() => onCellClick(rowIndex, colIndex)}
              row={rowIndex}
              col={colIndex}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
