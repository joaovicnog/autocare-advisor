import { Wrench, Shield } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full py-6 px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
            <Wrench className="w-7 h-7 text-primary-foreground" />
          </div>
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Inspeção Veicular
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
            <Shield className="w-4 h-4" />
            Sistema de Suporte Preventivo
          </p>
        </div>
      </div>
    </header>
  );
}
