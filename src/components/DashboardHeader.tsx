
import { Button } from "@/components/ui/button";
import APIKeyInput from "@/components/APIKeyInput";

export default function DashboardHeader() {
  return (
    <div className="flex items-center justify-between pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lenovo Market Whisperer</h1>
        <p className="text-muted-foreground">
          AI-powered dashboard for PC market share analysis
        </p>
      </div>
      <div className="flex items-center gap-4">
        <APIKeyInput />
        <Button variant="outline" size="sm" asChild>
          <a href="https://www.perplexity.ai/" target="_blank" rel="noopener noreferrer">
            Perplexity API Docs
          </a>
        </Button>
      </div>
    </div>
  );
}
