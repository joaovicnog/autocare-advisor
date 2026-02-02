import { Car, Calendar, Gauge, Fuel, MapPin } from 'lucide-react';
import type { VehicleInfo } from '@/lib/vehicleParser';

interface VehicleInfoCardProps {
  info: VehicleInfo;
}

export function VehicleInfoCard({ info }: VehicleInfoCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Car className="w-5 h-5 text-primary" />
        Veículo Identificado
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <InfoItem 
          icon={<Car className="w-4 h-4" />}
          label="Modelo"
          value={info.modelo}
        />
        <InfoItem 
          icon={<Calendar className="w-4 h-4" />}
          label="Ano"
          value={info.ano}
        />
        <InfoItem 
          icon={<Gauge className="w-4 h-4" />}
          label="Idade"
          value={info.idadeEstimada}
        />
        <InfoItem 
          icon={<MapPin className="w-4 h-4" />}
          label="Uso"
          value={info.tipoUso}
        />
        {info.combustivel && (
          <InfoItem 
            icon={<Fuel className="w-4 h-4" />}
            label="Combustível"
            value={info.combustivel}
          />
        )}
      </div>
      
      {info.quilometragem && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Quilometragem informada: <span className="font-medium text-foreground">{info.quilometragem}</span>
          </p>
        </div>
      )}
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
