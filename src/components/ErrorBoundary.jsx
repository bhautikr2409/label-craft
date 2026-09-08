import { Component } from 'react';

/**
 * Catches render errors in the tree below and shows a recoverable fallback.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h1>
            <p className="text-slate-600 text-sm mb-6">
              An unexpected error occurred. You can try again or return to the home page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReset}
                className="bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-teal-600 transition-colors"
              >
                Try again
              </button>
              <a
                href="/"
                className="border border-slate-200 text-slate-700 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
