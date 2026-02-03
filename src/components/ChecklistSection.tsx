import { useState, forwardRef } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, AlertCircle, Info, Check } from 'lucide-react';
import type { ChecklistItem } from '@/lib/vehicleParser';
import { cn } from '@/lib/utils';

type CategoryType = 'critical' | 'important' | 'recommended';

interface ChecklistSectionProps {
  title: string;
  description: string;
  items: ChecklistItem[];
  category: CategoryType;
  onToggleItem: (index: number) => void;
}

const categoryConfig = {
  critical: {
    icon: AlertTriangle,
    badge: 'badge-critical',
    border: 'category-critical',
    iconColor: 'text-critical',
    bgHover: 'hover:bg-critical/5'
  },
  important: {
    icon: AlertCircle,
    badge: 'badge-important',
    border: 'category-important',
    iconColor: 'text-important',
    bgHover: 'hover:bg-important/5'
  },
  recommended: {
    icon: Info,
    badge: 'badge-recommended',
    border: 'category-recommended',
    iconColor: 'text-recommended',
    bgHover: 'hover:bg-recommended/5'
  }
};

export const ChecklistSection = forwardRef<HTMLDivElement, ChecklistSectionProps>(
  function ChecklistSection({ title, description, items, category, onToggleItem }, ref) {
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const config = categoryConfig[category];
    const Icon = config.icon;

    const toggleExpand = (index: number) => {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(index)) {
        newExpanded.delete(index);
      } else {
        newExpanded.add(index);
      }
      setExpandedItems(newExpanded);
    };

    const checkedCount = items.filter(item => item.checked).length;

    return (
      <div ref={ref} className={cn("checklist-card", config.border, "animate-slide-up")}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", `bg-${category}/10`)}>
            <Icon className={cn("w-5 h-5", config.iconColor)} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <span className={cn("px-3 py-1 rounded-full text-sm font-medium", config.badge)}>
          {checkedCount}/{items.length}
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div 
            key={index}
            className={cn(
              "rounded-lg border border-border transition-all duration-200",
              config.bgHover,
              item.checked && "bg-success/5 border-success/30"
            )}
          >
            <div 
              className="flex items-center gap-3 p-4 cursor-pointer"
              onClick={() => toggleExpand(index)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleItem(index);
                }}
                className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200",
                  item.checked 
                    ? "bg-success border-success" 
                    : "border-muted-foreground/30 hover:border-primary"
                )}
              >
                {item.checked && <Check className="w-4 h-4 text-success-foreground" />}
              </button>
              
              <div className="flex-grow min-w-0">
                <h4 className={cn(
                  "font-medium",
                  item.checked ? "text-muted-foreground line-through" : "text-foreground"
                )}>
                  {item.item}
                </h4>
                <p className="text-sm text-muted-foreground truncate">{item.descricao}</p>
              </div>
              
              <button className="flex-shrink-0 p-1 rounded-md hover:bg-muted transition-colors">
                {expandedItems.has(index) ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>

            {expandedItems.has(index) && (
              <div className="px-4 pb-4 pt-0">
                <div className="pl-9 pt-3 border-t border-border">
                  <p className="text-sm font-medium text-foreground mb-1">Por que verificar?</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.justificativa}
                  </p>
                </div>
              </div>
            )}
          </div>
          ))}
        </div>
      </div>
    );
  }
);
