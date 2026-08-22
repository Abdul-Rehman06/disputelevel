import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Dispute Levels route error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-page">
          <p className="eyebrow">WE COULDN’T LOAD THIS PAGE</p>
          <h1>Please return to the homepage.</h1>
          <Link className="button-primary" to="/">Home</Link>
        </main>
      );
    }
    return this.props.children;
  }
}
