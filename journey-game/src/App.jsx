import { useEffect, useState } from 'react'
import './App.css'

const ALL_COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Pink', value: '#ec4899' },
]

const MAX_LEVEL = 8

const getRandomChoices = (count) => {
  const copy = [...ALL_COLORS]
  const result = []
  while (result.length < count && copy.length > 0) {
    const index = Math.floor(Math.random() * copy.length)
    result.push(...copy.splice(index, 1))
  }
  return result
}

function App() {
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [choices, setChoices] = useState(() => getRandomChoices(4))
  const [targetIndex, setTargetIndex] = useState(() => Math.floor(Math.random() * 4))
  const [timeoutProgress, setTimeoutProgress] = useState(100)
  const [lives, setLives] = useState(5)
  const [winScore, setWinScore] = useState(1000)
  const [message, setMessage] = useState('Pick the matching color button to win the round.')
  const [gameOver, setGameOver] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [showChampionPopup, setShowChampionPopup] = useState(false)

  const refreshRound = (nextMessage = 'Target color changed automatically. Tap the matching button.') => {
    const nextChoices = getRandomChoices(4)
    setChoices(nextChoices)
    setTargetIndex(Math.floor(Math.random() * nextChoices.length))
    setTimeoutProgress(100)
    setMessage(nextMessage)
  }

  const resetGame = () => {
    setLevel(1)
    setScore(0)
    setLives(5)
    setChoices(getRandomChoices(4))
    setTargetIndex(Math.floor(Math.random() * 4))
    setTimeoutProgress(100)
    setMessage('Pick the matching color button to win the round.')
    setGameOver(false)
    setCompleted(false)
    setShowChampionPopup(false)
  }

  const nextTarget = () => {
    if (gameOver || completed) return
    refreshRound()
  }

  useEffect(() => {
    if (gameOver || completed) return

    const timerId = setInterval(() => {
      setTimeoutProgress((current) => {
        if (current <= 5) {
          if (lives <= 1) {
            setLives(0)
            setGameOver(true)
            setMessage('Time expired! No chances left — game over.')
            return 0
          }

          const nextLives = lives - 1
          setLives(nextLives)
          refreshRound(`Time expired! ${nextLives} chance${nextLives === 1 ? '' : 's'} left.`)
          return 100
        }
        return current - 5
      })
    }, 100)

    return () => clearInterval(timerId)
  }, [gameOver, completed, lives])

  const handleColorClick = (index) => {
    if (gameOver || completed) return

    if (index === targetIndex) {
      const nextScore = score + level * 10
      setScore(nextScore)
      setBestScore((currentBest) => Math.max(currentBest, nextScore))

      if (nextScore >= winScore) {
        setCompleted(true)
        setShowChampionPopup(true)
        setMessage(`🏆 Congratulations! You reached ${winScore} points and became a champion.`)
        return
      }


      const nextLevel = level + 1
      setLevel(nextLevel)
      refreshRound()
      setMessage(`Correct! Level ${nextLevel} begins. Match the next color.`)
      return
    }

    const nextLives = lives - 1
    if (nextLives <= 0) {
      setLives(0)
      setGameOver(true)
      setMessage(`Wrong color! You picked ${choices[index].name}. No chances left — game over.`)
      return
    }

    setLives(nextLives)
    setMessage(`Wrong color! You picked ${choices[index].name}. ${nextLives} chance${nextLives === 1 ? '' : 's'} left.`)
  }

  const targetStyle = completed
    ? { background: 'linear-gradient(135deg, #f59e0b, #b45309)', color: '#0f172a' }
    : { background: choices[targetIndex]?.value ?? '#3b82f6', color: '#0f172a' }

  return (
    <main className="app-shell">
      <header className="title-bar">
        <div className="header-top">
          <div className="title-copy">
            <p className="badge">⚡ Color Pickup</p>
            <h1>Ready to match the color?</h1>
            <p className="subtitle">Tap the target tone before time runs out and climb the leaderboard.</p>
          </div>
          <div className="stat-chips">
            <span className="chip">⭐ LEVEL {level}</span>
            <span className="chip">🏅 BEST {bestScore}</span>
            <span className="chip">⚡ PTS {score}</span>
          </div>
        </div>

        <div className="header-status">
          <div className="status-card">
            <span>{completed ? '👑 Champion' : `🔥 Play Now`}</span>
            <strong>{completed ? '🥇' : gameOver ? '💥 Game Over' : `Match color`}</strong>
          </div>
          <div className="heart-row" aria-label="Lives remaining">
            {Array.from({ length: lives }, (_, index) => (
              <span key={index}>❤️</span>
            ))}
            {lives === 0 && <span className="life-text">No chances left</span>}
          </div>
        </div>
      </header>

      <section className="game-panel">
        <div className="panel-info">
          <p>{message}</p>
          <label className="win-score-label">
            Win points:
            <input
              type="number"
              min="10"
              step="10"
              value={winScore}
              onChange={(event) => setWinScore(Number(event.target.value) || 1000)}
              className="win-score-input"
            />
          </label>
        </div>

        <div className="target-card">
          <div className="target-circle" style={targetStyle} />
          <div className="target-meta">
            <span>{completed ? 'Champion 🏆' : 'Match this color'}</span>
            {!completed && <strong>{choices[targetIndex]?.name}</strong>}
          </div>
          {!completed && (
            <div className="timeout-row">
              <span className="timeout-label">⏳</span>
              <div className="timeout-bar">
                <div className="timeout-fill" style={{ width: `${timeoutProgress}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="color-grid">
          {choices.map((color, index) => (
            <button
              key={`${color.name}-${index}`}
              type="button"
              className="color-button"
              style={{ background: color.value }}
              onClick={() => handleColorClick(index)}
              disabled={gameOver || completed}
            >
              {color.name}
            </button>
          ))}
        </div>
      </section>

      {showChampionPopup && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-icon">🏆</div>
            <h2>Champion!</h2>
            <p>You reached {winScore} points — congratulations on becoming a champion.</p>
            <button className="modal-close" type="button" onClick={() => setShowChampionPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <footer className="control-panel">
        <button className="game-button accent" onClick={resetGame}>
          <span className="button-icon">🔄</span>
          Restart
        </button>
        <button className="game-button" onClick={nextTarget} disabled={gameOver || completed}>
          <span className="button-icon">🔁</span>
          Shuffle Target
        </button>
      </footer>
    </main>
  )
}

export default App
