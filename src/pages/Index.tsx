import { useState } from 'react';
import { Header } from '@/components/Header';
import { VehicleInput } from '@/components/VehicleInput';
import { ChecklistResults } from '@/components/ChecklistResults';
import { parseVehicleDescription, generateChecklist, ChecklistResult } from '@/lib/vehicleParser';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ChecklistResult | null>(null);

  const handleSubmit = async (description: string) => {
    setIsLoading(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const vehicleInfo = parseVehicleDescription(description);
    const checklist = generateChecklist(vehicleInfo);
    
    setResult(checklist);
    setIsLoading(false);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />
        
        <main className="px-4 pb-12">
          {result ? (
            <ChecklistResults result={result} onReset={handleReset} />
          ) : (
            <div className="space-y-8">
              <VehicleInput onSubmit={handleSubmit} isLoading={isLoading} />
              
              {/* Features */}
              <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FeatureCard
                    emoji="🔍"
                    title="Análise Inteligente"
                    description="Interpreta descrições livres e identifica o perfil do veículo"
                  />
                  <FeatureCard
                    emoji="📋"
                    title="Checklist Personalizado"
                    description="Itens priorizados por criticidade para seu tipo de uso"
                  />
                  <FeatureCard
                    emoji="📚"
                    title="Justificativas Técnicas"
                    description="Entenda por que cada item é importante para seu veículo"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

function FeatureCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="glass-card rounded-xl p-5 text-center hover:shadow-md transition-shadow">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default Index;
