import { Component } from "react";
import { Button, Card, CardContent } from "./ui/index.js";
import { PageContainer, SectionHeader } from "./layout/index.js";

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
  }

  handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <PageContainer className="flex min-h-screen items-center justify-center py-8">
          <Card className="w-full max-w-5xl rounded-[32px] p-6 md:p-8">
            <CardContent className="gap-6">
              <SectionHeader
                eyebrow="Something broke"
                title="We can recover from this."
                description="The app hit an unexpected runtime problem. Reloading usually gets you back in quickly."
              />
              <p className="rounded-[var(--ds-radius-lg)] border border-[rgba(255,127,159,0.18)] bg-[rgba(255,127,159,0.08)] px-4 py-3 text-sm text-[var(--ds-color-text-secondary)]">
                {this.state.message}
              </p>
              <div className="flex justify-start">
                <Button type="button" onClick={this.handleReload}>
                  Reload app
                </Button>
              </div>
            </CardContent>
          </Card>
        </PageContainer>
      );
    }

    return this.props.children;
  }
}

export class WidgetErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "This part of the workspace could not load.",
    };
  }

  componentDidCatch() {
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="section-loading-card widget-fallback-card p-4">
          <CardContent className="gap-2">
            <strong>{this.props.title || "Section unavailable"}</strong>
            <p>{this.props.description || "Refresh the app to try loading this section again."}</p>
            <p className="muted-text">{this.state.message}</p>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
