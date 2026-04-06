import styles from './PatternShowcase.module.css'

interface PatternCell {
  label: string
  isHighlighted: boolean
  isFree: boolean
}

interface Pattern {
  name: string
  description: string
  grid: PatternCell[][]
  colorClass: string
}

/**
 * PatternShowcase component displays visual examples of winning Bingo patterns
 * using colored tiles to show what a winning pattern looks like.
 */
export function PatternShowcase() {
  const patterns: Pattern[] = [
    {
      name: 'Horizontal Line',
      description: 'Complete any row',
      colorClass: 'horizontal',
      grid: [
        [
          { label: '1', isHighlighted: true, isFree: false },
          { label: '2', isHighlighted: true, isFree: false },
          { label: '3', isHighlighted: true, isFree: false },
          { label: '4', isHighlighted: true, isFree: false },
          { label: '5', isHighlighted: true, isFree: false },
        ],
        [
          { label: '6', isHighlighted: false, isFree: false },
          { label: '7', isHighlighted: false, isFree: false },
          { label: '8', isHighlighted: false, isFree: false },
          { label: '9', isHighlighted: false, isFree: false },
          { label: '10', isHighlighted: false, isFree: false },
        ],
        [
          { label: '11', isHighlighted: false, isFree: false },
          { label: '12', isHighlighted: false, isFree: false },
          { label: 'FREE', isHighlighted: false, isFree: true },
          { label: '13', isHighlighted: false, isFree: false },
          { label: '14', isHighlighted: false, isFree: false },
        ],
        [
          { label: '15', isHighlighted: false, isFree: false },
          { label: '16', isHighlighted: false, isFree: false },
          { label: '17', isHighlighted: false, isFree: false },
          { label: '18', isHighlighted: false, isFree: false },
          { label: '19', isHighlighted: false, isFree: false },
        ],
        [
          { label: '20', isHighlighted: false, isFree: false },
          { label: '21', isHighlighted: false, isFree: false },
          { label: '22', isHighlighted: false, isFree: false },
          { label: '23', isHighlighted: false, isFree: false },
          { label: '24', isHighlighted: false, isFree: false },
        ],
      ],
    },
    {
      name: 'Vertical Line',
      description: 'Complete any column',
      colorClass: 'vertical',
      grid: [
        [
          { label: '1', isHighlighted: true, isFree: false },
          { label: '2', isHighlighted: false, isFree: false },
          { label: '3', isHighlighted: false, isFree: false },
          { label: '4', isHighlighted: false, isFree: false },
          { label: '5', isHighlighted: false, isFree: false },
        ],
        [
          { label: '6', isHighlighted: true, isFree: false },
          { label: '7', isHighlighted: false, isFree: false },
          { label: '8', isHighlighted: false, isFree: false },
          { label: '9', isHighlighted: false, isFree: false },
          { label: '10', isHighlighted: false, isFree: false },
        ],
        [
          { label: '11', isHighlighted: true, isFree: false },
          { label: '12', isHighlighted: false, isFree: false },
          { label: 'FREE', isHighlighted: false, isFree: true },
          { label: '13', isHighlighted: false, isFree: false },
          { label: '14', isHighlighted: false, isFree: false },
        ],
        [
          { label: '15', isHighlighted: true, isFree: false },
          { label: '16', isHighlighted: false, isFree: false },
          { label: '17', isHighlighted: false, isFree: false },
          { label: '18', isHighlighted: false, isFree: false },
          { label: '19', isHighlighted: false, isFree: false },
        ],
        [
          { label: '20', isHighlighted: true, isFree: false },
          { label: '21', isHighlighted: false, isFree: false },
          { label: '22', isHighlighted: false, isFree: false },
          { label: '23', isHighlighted: false, isFree: false },
          { label: '24', isHighlighted: false, isFree: false },
        ],
      ],
    },
    {
      name: 'Diagonal',
      description: 'Connect corners (either direction)',
      colorClass: 'diagonal',
      grid: [
        [
          { label: '1', isHighlighted: true, isFree: false },
          { label: '2', isHighlighted: false, isFree: false },
          { label: '3', isHighlighted: false, isFree: false },
          { label: '4', isHighlighted: false, isFree: false },
          { label: '5', isHighlighted: false, isFree: false },
        ],
        [
          { label: '6', isHighlighted: false, isFree: false },
          { label: '7', isHighlighted: true, isFree: false },
          { label: '8', isHighlighted: false, isFree: false },
          { label: '9', isHighlighted: false, isFree: false },
          { label: '10', isHighlighted: false, isFree: false },
        ],
        [
          { label: '11', isHighlighted: false, isFree: false },
          { label: '12', isHighlighted: false, isFree: false },
          { label: 'FREE', isHighlighted: true, isFree: true },
          { label: '13', isHighlighted: false, isFree: false },
          { label: '14', isHighlighted: false, isFree: false },
        ],
        [
          { label: '15', isHighlighted: false, isFree: false },
          { label: '16', isHighlighted: false, isFree: false },
          { label: '17', isHighlighted: false, isFree: false },
          { label: '18', isHighlighted: true, isFree: false },
          { label: '19', isHighlighted: false, isFree: false },
        ],
        [
          { label: '20', isHighlighted: false, isFree: false },
          { label: '21', isHighlighted: false, isFree: false },
          { label: '22', isHighlighted: false, isFree: false },
          { label: '23', isHighlighted: false, isFree: false },
          { label: '24', isHighlighted: true, isFree: false },
        ],
      ],
    },
    {
      name: 'Four Corners',
      description: 'Mark all four corners',
      colorClass: 'corners',
      grid: [
        [
          { label: '1', isHighlighted: true, isFree: false },
          { label: '2', isHighlighted: false, isFree: false },
          { label: '3', isHighlighted: false, isFree: false },
          { label: '4', isHighlighted: false, isFree: false },
          { label: '5', isHighlighted: true, isFree: false },
        ],
        [
          { label: '6', isHighlighted: false, isFree: false },
          { label: '7', isHighlighted: false, isFree: false },
          { label: '8', isHighlighted: false, isFree: false },
          { label: '9', isHighlighted: false, isFree: false },
          { label: '10', isHighlighted: false, isFree: false },
        ],
        [
          { label: '11', isHighlighted: false, isFree: false },
          { label: '12', isHighlighted: false, isFree: false },
          { label: 'FREE', isHighlighted: false, isFree: true },
          { label: '13', isHighlighted: false, isFree: false },
          { label: '14', isHighlighted: false, isFree: false },
        ],
        [
          { label: '15', isHighlighted: false, isFree: false },
          { label: '16', isHighlighted: false, isFree: false },
          { label: '17', isHighlighted: false, isFree: false },
          { label: '18', isHighlighted: false, isFree: false },
          { label: '19', isHighlighted: false, isFree: false },
        ],
        [
          { label: '20', isHighlighted: true, isFree: false },
          { label: '21', isHighlighted: false, isFree: false },
          { label: '22', isHighlighted: false, isFree: false },
          { label: '23', isHighlighted: false, isFree: false },
          { label: '24', isHighlighted: true, isFree: false },
        ],
      ],
    },
    {
      name: 'Full Board',
      description: 'Mark all numbers',
      colorClass: 'fullboard',
      grid: [
        [
          { label: '1', isHighlighted: true, isFree: false },
          { label: '2', isHighlighted: true, isFree: false },
          { label: '3', isHighlighted: true, isFree: false },
          { label: '4', isHighlighted: true, isFree: false },
          { label: '5', isHighlighted: true, isFree: false },
        ],
        [
          { label: '6', isHighlighted: true, isFree: false },
          { label: '7', isHighlighted: true, isFree: false },
          { label: '8', isHighlighted: true, isFree: false },
          { label: '9', isHighlighted: true, isFree: false },
          { label: '10', isHighlighted: true, isFree: false },
        ],
        [
          { label: '11', isHighlighted: true, isFree: false },
          { label: '12', isHighlighted: true, isFree: false },
          { label: 'FREE', isHighlighted: true, isFree: true },
          { label: '13', isHighlighted: true, isFree: false },
          { label: '14', isHighlighted: true, isFree: false },
        ],
        [
          { label: '15', isHighlighted: true, isFree: false },
          { label: '16', isHighlighted: true, isFree: false },
          { label: '17', isHighlighted: true, isFree: false },
          { label: '18', isHighlighted: true, isFree: false },
          { label: '19', isHighlighted: true, isFree: false },
        ],
        [
          { label: '20', isHighlighted: true, isFree: false },
          { label: '21', isHighlighted: true, isFree: false },
          { label: '22', isHighlighted: true, isFree: false },
          { label: '23', isHighlighted: true, isFree: false },
          { label: '24', isHighlighted: true, isFree: false },
        ],
      ],
    },
  ]

  return (
    <div className={styles.root}>
      <div className={styles.patternsGrid}>
        {patterns.map((pattern) => (
          <div key={pattern.name} className={styles.patternContainer}>
            <div className={styles.patternHeader}>
              <h4 className={styles.patternName}>{pattern.name}</h4>
              <p className={styles.patternDesc}>{pattern.description}</p>
            </div>

            <div className={`${styles.patternGrid} ${styles[pattern.colorClass]}`}>
              {pattern.grid.map((row, rowIdx) => (
                <div key={rowIdx} className={styles.patternRow}>
                  {row.map((cell, colIdx) => (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      className={`${styles.patternCell} ${
                        cell.isHighlighted ? styles.highlighted : styles.unmarked
                      }`}
                      aria-label={`${cell.label}${cell.isHighlighted ? ', marked' : ''}`}
                    >
                      <span className={styles.cellContent}>{cell.label}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
