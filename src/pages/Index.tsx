import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { TabNavigation } from "@/components/dashboard/TabNavigation";
import { OverviewTab } from "@/components/tabs/OverviewTab";
import { RecommendationsTab } from "@/components/tabs/RecommendationsTab";
import { AlignmentTab } from "@/components/tabs/AlignmentTab";
import { InjuryTab } from "@/components/tabs/InjuryTab";
import { AdjusterTab } from "@/components/tabs/AdjusterTab";
import { VenueTab } from "@/components/tabs/VenueTab";
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
        {activeTab === 'recommendations' && <RecommendationsTab data={filteredData} />}
        {activeTab === 'alignment' && <AlignmentTab data={filteredData} />}
        {activeTab === 'injury' && <InjuryTab data={filteredData} />}
        {activeTab === 'adjuster' && <AdjusterTab data={filteredData} />}
        {activeTab === 'venue' && <VenueTab data={filteredData} />}
      </main>
    </div>
  );
};

export default Index;
