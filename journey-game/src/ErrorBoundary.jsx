import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-shell">
          <header className="title-bar">
            <div>
              <p className="badge">Journey Game</p>
              <h1>Something Went Wrong</h1>
              <p className="subtitle">The game failed to load correctly.</p>
            </div>
          </header>
          <section className="game-panel">
            <div className="panel-info">
              <p>Reload the page or restart the dev server.</p>
              <pre style={{ whiteSpace: 'pre-wrap', color: '#f87171' }}>
                {String(this.state.error)}
              </pre>
            </div>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
