import { useState } from 'react';
import { ChecklistSection } from './ChecklistSection';
import { VehicleInfoCard } from './VehicleInfoCard';
import { ClipboardList, RotateCcw, Printer, ExternalLink, BookOpen } from 'lucide-react';
import type { ChecklistResult, ChecklistItem } from '@/lib/vehicleParser';

interface ChecklistResultsProps {
  result: ChecklistResult;
  onReset: () => void;
}

export function ChecklistResults({ result, onReset }: ChecklistResultsProps) {
  const [checklist, setChecklist] = useState(result);

  const toggleItem = (category: 'criticos' | 'importantes' | 'recomendados', index: number) => {
    setChecklist(prev => ({
      ...prev,
      [category]: prev[category].map((item, i) => 
        i === index ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  const totalItems = checklist.criticos.length + checklist.importantes.length + checklist.recomendados.length;
  const checkedItems = [
    ...checklist.criticos,
    ...checklist.importantes,
    ...checklist.recomendados
  ].filter(item => item.checked).length;

  const progress = Math.round((checkedItems / totalItems) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
              <ClipboardList className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Checklist de Inspeção</h2>
              <p className="text-sm text-muted-foreground">
                {checkedItems} de {totalItems} itens verificados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-grow md:flex-grow-0 md:w-32">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-success transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-center">{progress}% completo</p>
            </div>

            <button
              onClick={handlePrint}
              className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
              title="Imprimir checklist"
            >
              <Printer className="w-5 h-5 text-muted-foreground" />
            </button>

            <button
              onClick={onReset}
              className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
              title="Nova inspeção"
            >
              <RotateCcw className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <VehicleInfoCard info={checklist.vehicleInfo} />

      {/* Checklists */}
      <ChecklistSection
        title="Itens Críticos"
        description="Verificação obrigatória — Afetam diretamente a segurança"
        items={checklist.criticos}
        category="critical"
        onToggleItem={(index) => toggleItem('criticos', index)}
      />

      <ChecklistSection
        title="Itens Importantes"
        description="Verificação recomendada — Previnem falhas e custos futuros"
        items={checklist.importantes}
        category="important"
        onToggleItem={(index) => toggleItem('importantes', index)}
      />

      <ChecklistSection
        title="Itens Recomendados"
        description="Verificação sugerida — Melhoram conforto e durabilidade"
        items={checklist.recomendados}
        category="recommended"
        onToggleItem={(index) => toggleItem('recomendados', index)}
      />

      {/* Technical Sources */}
      {checklist.fontes && checklist.fontes.length > 0 && (
        <div className="glass-card rounded-2xl p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10">
              <BookOpen className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Fontes Técnicas</h3>
              <p className="text-sm text-muted-foreground">Referências utilizadas para este checklist</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {checklist.fontes.map((fonte, index) => (
              <a
                key={index}
                href={fonte.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {fonte.titulo}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {fonte.descricao}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 group-hover:text-primary transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="glass-card rounded-2xl p-6 text-center animate-fade-in">
        <p className="text-sm text-muted-foreground">
          ⚠️ Este checklist é uma orientação baseada em boas práticas de manutenção automotiva.
          <br />
          Consulte sempre um mecânico qualificado para diagnóstico profissional.
        </p>
      </div>
    </div>
  );
}
