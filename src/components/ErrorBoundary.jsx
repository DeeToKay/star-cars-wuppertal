import React from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white font-inter flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#E30613]/15 border border-[#E30613]/40 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-[#E30613]" />
          </div>
          <h1 className="text-2xl font-black mb-3">Etwas ist schiefgelaufen</h1>
          <p className="text-[#C9C9D1] text-sm mb-8 leading-relaxed">
            Es ist ein unerwarteter Fehler aufgetreten. Bitte laden Sie die Seite neu oder kehren Sie zur Startseite zurück.
            Falls das Problem bestehen bleibt, kontaktieren Sie uns unter{" "}
            <a href="mailto:info@starcarswuppertal.com" className="text-[#E30613] underline">
              info@starcarswuppertal.com
            </a>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={this.handleReload}
              className="flex items-center justify-center gap-2 bg-[#E30613] text-white font-bold px-6 py-3 hover:bg-[#c0000f] transition-colors"
            >
              <RefreshCcw className="w-4 h-4" /> Seite neu laden
            </button>
            <button
              onClick={this.handleHome}
              className="flex items-center justify-center gap-2 border border-white/20 text-white px-6 py-3 hover:border-white/50 transition-colors"
            >
              <Home className="w-4 h-4" /> Zur Startseite
            </button>
          </div>
        </div>
      </div>
    );
  }
}
