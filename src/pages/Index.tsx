
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/DashboardHeader";
import MarketShareChart from "@/components/MarketShareChart";
import GrowthComparisonChart from "@/components/GrowthComparisonChart";
import MarketShareTrendChart from "@/components/MarketShareTrendChart";
import CompetitiveAnalysis from "@/components/CompetitiveAnalysis";
import CompanyMetrics from "@/components/CompanyMetrics";
import { usePerplexityStore } from "@/services/perplexityService";

export default function Dashboard() {
  // Initialize API key from localStorage on mount
  React.useEffect(() => {
    const savedKey = localStorage.getItem('perplexityApiKey');
    if (savedKey) {
      usePerplexityStore.getState().setApiKey(savedKey);
    }
  }, []);

  return (
    <div className="container py-6 space-y-4 md:space-y-8">
      <DashboardHeader />
      
      <CompanyMetrics />
      
      <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <MarketShareChart />
        <GrowthComparisonChart />
        <div className="md:col-span-2 xl:col-span-1">
          <MarketShareTrendChart />
        </div>
      </div>
      
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analysis">Competitive Analysis</TabsTrigger>
          <TabsTrigger value="insights">Strategic Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="analysis" className="p-0 mt-4">
          <CompetitiveAnalysis />
        </TabsContent>
        <TabsContent value="insights" className="p-0 mt-4">
          <div className="grid gap-4">
            <p className="text-sm text-muted-foreground">
              Use the analysis tools to gain strategic insights about Lenovo's market position compared to competitors. 
              Ask any question about the PC market data.
            </p>
            <CompetitiveAnalysis />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
