import { Component, type ReactNode, type ErrorInfo } from 'react';
import { captureException } from './client';

/**
 * React bindings for @empoweredvote/analytics. Imported via the subpath:
 *
 *   import { AppErrorBoundary } from '@empoweredvote/analytics/react';
 *
 * Kept in a separate entry so apps that don't use React (e.g. the static
 * landing page) never pull React into their bundle.
 */

interface AppErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback UI. Omit for the built-in "something went wrong" screen. */
  fallback?: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches render-time errors in the React tree and reports them to PostHog.
 * Exception autocapture only sees window.onerror / unhandledrejection, NOT
 * React render errors — so this boundary is required for full coverage.
 *
 * It deliberately does NOT auto-retry the failed subtree: re-rendering the same
 * broken tree can loop and spam captureException. It shows a static fallback
 * with a manual reload (a user action, not an automatic retry).
 */
export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    try {
      captureException(error, {
        componentStack: info.componentStack,
        $exception_source: 'react-error-boundary',
      });
    } catch {
      // Never let error reporting throw from inside the boundary.
    }
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;
    return (
      <div
        role="alert"
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center',
          font: '400 1rem/1.5 system-ui, -apple-system, sans-serif',
        }}
      >
        <p style={{ margin: 0 }}>Something went wrong on this page.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '0.5rem',
            border: '1px solid currentColor',
            background: 'transparent',
            font: 'inherit',
            cursor: 'pointer',
          }}
        >
          Reload
        </button>
      </div>
    );
  }
}
