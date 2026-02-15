import React from "react";
import "./Styles/ErrorBoundary.css";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h1>Algo salió mal</h1>
            <p>La aplicación encontró un error inesperado.</p>
            <p className="error-boundary-hint">Puedes recargar la página para intentar de nuevo.</p>
            <button type="button" className="error-boundary-button" onClick={this.handleReload}>
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
