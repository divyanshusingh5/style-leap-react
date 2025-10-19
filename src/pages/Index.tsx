import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { TabNavigation } from "@/components/dashboard/TabNavigation";
import { OverviewTab } from "@/components/tabs/OverviewTab";
import { useClaimsData } from "@/hooks/useClaimsData";
import { TabType } from "@/types/claims";

const Index = () => {
  const { filteredData, filters, updateFilter, counties } = useClaimsData();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header filters={filters} counties={counties} onFilterChange={updateFilter} />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {activeTab === 'overview' && <OverviewTab data={filteredData} />}
        {activeTab === 'recommendations' && (
          <div className="bg-card rounded-xl p-8 border border-border shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Recommendations Tab
            </h2>
            <p className="text-muted-foreground">Coming soon: Variance features and adjuster recommendations</p>
          </div>
        )}
        {activeTab === 'alignment' && (
          <div className="bg-card rounded-xl p-8 border border-border shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Model Alignment Tab
            </h2>
            <p className="text-muted-foreground">Coming soon: Consensus vs Model alignment analysis</p>
          </div>
        )}
        {activeTab === 'injury' && (
          <div className="bg-card rounded-xl p-8 border border-border shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Injury Analysis Tab
            </h2>
            <p className="text-muted-foreground">Coming soon: Injury group analysis and trends</p>
          </div>
        )}
        {activeTab === 'adjuster' && (
          <div className="bg-card rounded-xl p-8 border border-border shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Adjuster Performance Tab
            </h2>
            <p className="text-muted-foreground">Coming soon: Adjuster performance metrics</p>
          </div>
        )}
        {activeTab === 'venue' && (
          <div className="bg-card rounded-xl p-8 border border-border shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Venue Analysis Tab
            </h2>
            <p className="text-muted-foreground">Coming soon: State and county venue analysis</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
