import { useState } from 'react';
import { Car, Search, Loader2 } from 'lucide-react';

interface VehicleInputProps {
  onSubmit: (description: string) => void;
  isLoading: boolean;
}

export function VehicleInput({ onSubmit, isLoading }: VehicleInputProps) {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit(description);
    }
  };

  const placeholder = `Ex: Tenho um Gol 2015 flex, uso principalmente para ir ao trabalho na cidade. Rodo cerca de 30km por dia no trânsito de São Paulo...

Ou: Corolla 2020, uso para viagens na estrada nos fins de semana. Já rodou 45 mil km.

Descreva livremente: modelo, ano, quilometragem, tipo de uso (cidade, estrada, comercial), combustível, etc.`;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="glass-card rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
            <Car className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Descreva seu veículo</h2>
            <p className="text-sm text-muted-foreground">Inclua modelo, ano, quilometragem e tipo de uso</p>
          </div>
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={placeholder}
          className="input-vehicle w-full"
          rows={6}
          disabled={isLoading}
        />

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            💡 Quanto mais detalhes, mais preciso será o checklist
          </p>
          <button
            type="submit"
            disabled={!description.trim() || isLoading}
            className="btn-generate w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Gerar Checklist
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
