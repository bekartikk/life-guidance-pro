import { Component } from "react";

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Something went wrong while loading the app.",
    };
  }

  componentDidCatch() {
    // Log suppressed for production
  }

  handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="workspace-panel error-boundary-panel">
          <p className="eyebrow">Something broke</p>
          <h2>We can recover from this.</h2>
          <p className="muted-text">
            The app hit an unexpected runtime problem. Reloading usually gets you back in quickly.
          </p>
          <p className="error-message">{this.state.message}</p>
          <button className="primary-button" type="button" onClick={this.handleReload}>
            Reload app
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
