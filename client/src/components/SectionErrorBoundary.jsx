import React from "react";
import "./Styles/SectionErrorBoundary.css";

/**
 * Error boundary granular para secciones. Si una sección falla,
 * muestra un fallback con botón de retry sin romper el resto de la página.
 */
export default class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, retryKey: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SectionErrorBoundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState((s) => ({ hasError: false, error: null, retryKey: s.retryKey + 1 }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="section-error-boundary">
          <span className="material-symbols-rounded section-error-boundary__icon">
            error_outline
          </span>
          <p className="section-error-boundary__text">
            Algo falló en esta sección
          </p>
          <button
            type="button"
            className="section-error-boundary__btn"
            onClick={this.handleRetry}
          >
            Reintentar
          </button>
        </div>
      );
    }
    return <React.Fragment key={this.state.retryKey}>{this.props.children}</React.Fragment>;
  }
}
