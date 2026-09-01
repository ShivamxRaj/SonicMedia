import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'Outfit, sans-serif',
          textAlign: 'center',
          padding: '20px'
        }}>
          <h2 style={{ fontSize: '1.8rem', color: '#f43f5e', marginBottom: '12px' }}>
            ⚡ Application Recovering...
          </h2>
          <p style={{ color: '#f87171', marginBottom: '16px', maxWidth: '600px', background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
            {this.state.error?.toString() || 'Unknown Error'}
          </p>
          <button
            onClick={() => {
              try { localStorage.clear(); } catch(e) {}
              this.setState({ hasError: false, error: null });
            }}
            style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Reset Studio App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
