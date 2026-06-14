import { type ReactNode, Component } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0C0C0C',
            color: '#E9E4D8',
            fontFamily: "'Special_Elite', monospace",
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: '1.5rem',
              letterSpacing: '0.25em',
              color: '#D03A2B',
              marginBottom: '1rem',
            }}
          >
            SYSTEM MALFUNCTION
          </div>
          <p style={{ maxWidth: '400px', color: 'rgba(233,228,216,0.5)', fontSize: '0.85rem', lineHeight: 1.8 }}>
            An unexpected error has occurred. The system has been compromised.
            Please reload the page to re-establish secure connection.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '2rem',
              border: '2px solid #D03A2B',
              color: '#D03A2B',
              backgroundColor: 'transparent',
              padding: '0.75rem 2rem',
              fontFamily: "'Oswald', sans-serif",
              fontSize: '0.8rem',
              letterSpacing: '0.2em',
              cursor: 'pointer',
            }}
          >
            RELOAD SYSTEM
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
