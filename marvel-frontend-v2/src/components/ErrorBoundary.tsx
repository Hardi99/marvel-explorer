import { Component } from 'react';
import type { ReactNode } from 'react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#111111] flex items-center justify-center px-6">
          <div className="text-center">
            <div className="bg-[#ec1d24] text-white font-black text-2xl px-3 py-1 inline-block tracking-tighter mb-6">
              MARVEL
            </div>
            <h1 className="text-xl font-black uppercase text-white mb-3">
              Une erreur est survenue
            </h1>
            <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto font-mono">
              {this.state.message}
            </p>
            <Button onClick={() => window.location.reload()}>
              Recharger la page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
