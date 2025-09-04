import React, { Component } from "react";
import type { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary component provides graceful error handling for production environments
 * Catches JavaScript errors anywhere in the child component tree and displays fallback UI
 *
 * Features:
 * - Prevents white screen of death in production
 * - Provides user-friendly error messaging
 * - Logs errors for debugging (in development)
 * - Allows application recovery without full page reload
 *
 * @example
 * <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <ColorPicker />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details in development
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // In production, you might want to log to an error reporting service
    // Example: errorReportingService.captureException(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI or default error message
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            backgroundColor: "#f9fafb",
            margin: "1rem",
            fontFamily: '"Roboto", sans-serif',
          }}
        >
          <h2
            style={{
              color: "#374151",
              fontSize: "1.25rem",
              marginBottom: "1rem",
              fontWeight: 600,
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              color: "#6b7280",
              marginBottom: "1.5rem",
              lineHeight: 1.5,
            }}
          >
            The color picker encountered an unexpected error. This has been
            logged and will be investigated.
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 500,
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#4338ca";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#4f46e5";
            }}
          >
            Try Again
          </button>
          {import.meta.env.DEV && this.state.error && (
            <details
              style={{
                marginTop: "1rem",
                textAlign: "left",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "4px",
                padding: "1rem",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  color: "#dc2626",
                  fontWeight: 500,
                  marginBottom: "0.5rem",
                }}
              >
                Error Details (Development)
              </summary>
              <pre
                style={{
                  fontSize: "0.75rem",
                  color: "#7f1d1d",
                  overflow: "auto",
                  margin: 0,
                }}
              >
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
