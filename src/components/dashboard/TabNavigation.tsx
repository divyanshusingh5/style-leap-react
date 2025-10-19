import { TabType } from "@/types/claims";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'overview', label: 'Executive Overview' },
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'alignment', label: 'Model Alignment' },
  { id: 'injury', label: 'Injury Analysis' },
  { id: 'adjuster', label: 'Adjuster Performance' },
  { id: 'venue', label: 'Venue Analysis' },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200",
                "border-b-2 hover:text-primary",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
