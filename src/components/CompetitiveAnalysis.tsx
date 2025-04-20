
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  queryPerplexity, 
  sampleQuestions,
  usePerplexityStore 
} from "@/services/perplexityService";
import { Loader2, AlertTriangle } from "lucide-react";

interface AnalysisResult {
  analysis: string;
  key_points: string[];
  visualization_suggestions: string;
  error?: string;
}

export default function CompetitiveAnalysis() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { apiKey } = usePerplexityStore();

  const handleAnalyze = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const response = await queryPerplexity(question);
      setResult(response);
    } catch (error) {
      console.error("Error analyzing:", error);
      setResult({
        analysis: "An error occurred during analysis.",
        key_points: [],
        visualization_suggestions: "",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSampleQuestion = (q: string) => {
    setQuestion(q);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Market Intelligence Analyzer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask a question about the market data..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading || !apiKey}
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={loading || !question.trim() || !apiKey}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing
                </>
              ) : (
                "Analyze"
              )}
            </Button>
          </div>
          
          {!apiKey && (
            <div className="mt-2 flex items-center text-sm text-amber-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Please set your Perplexity API key to use this feature
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Sample Questions:</h3>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.slice(0, 3).map((q, i) => (
              <Button 
                key={i} 
                variant="outline" 
                size="sm" 
                onClick={() => handleSampleQuestion(q)}
                disabled={loading || !apiKey}
              >
                {q.length > 40 ? q.substring(0, 37) + "..." : q}
              </Button>
            ))}
          </div>
        </div>

        {result && (
          <div className="mt-6">
            {result.error ? (
              <div className="p-4 bg-red-50 text-red-700 rounded-md">
                <h3 className="font-bold mb-2">Error</h3>
                <p>{result.error}</p>
              </div>
            ) : (
              <Tabs defaultValue="analysis">
                <TabsList className="mb-4">
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="keyPoints">Key Points</TabsTrigger>
                  <TabsTrigger value="visualization">Visualization Ideas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="analysis" className="p-4 bg-muted/50 rounded-md">
                  <p>{result.analysis}</p>
                </TabsContent>
                
                <TabsContent value="keyPoints">
                  <ul className="list-disc pl-5 space-y-2">
                    {result.key_points?.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    )) || <li>No key points available</li>}
                  </ul>
                </TabsContent>
                
                <TabsContent value="visualization" className="p-4 bg-muted/50 rounded-md">
                  <p>{result.visualization_suggestions || "No visualization suggestions available"}</p>
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
