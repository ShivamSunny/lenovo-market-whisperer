
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  queryPerplexity, 
  sampleQuestions
} from "@/services/perplexityService";
import { Loader2, AlertTriangle, MessageSquare } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
  const [recentQuestions, setRecentQuestions] = useState<string[]>([]);

  const handleAnalyze = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const response = await queryPerplexity(question);
      
      if (response.error) {
        toast({
          title: "Analysis Error",
          description: response.error,
          variant: "destructive"
        });
      }
      
      setResult(response);
      
      // Add to recent questions (no duplicates)
      if (!recentQuestions.includes(question)) {
        setRecentQuestions(prev => [question, ...prev].slice(0, 5));
      }
    } catch (error) {
      console.error("Error analyzing:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not process your market analysis request",
        variant: "destructive"
      });
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

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && question.trim()) {
      handleAnalyze();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Market Intelligence Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask any question about the PC market data..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              className="flex-1"
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={loading || !question.trim()}
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
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Sample Questions:</h3>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.slice(0, 3).map((q, i) => (
              <Button 
                key={i} 
                variant="outline" 
                size="sm" 
                onClick={() => handleSampleQuestion(q)}
                disabled={loading}
              >
                {q.length > 40 ? q.substring(0, 37) + "..." : q}
              </Button>
            ))}
          </div>
        </div>

        {recentQuestions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Recent Questions:</h3>
            <div className="flex flex-wrap gap-2">
              {recentQuestions.map((q, i) => (
                <Button 
                  key={i} 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSampleQuestion(q)}
                  disabled={loading}
                >
                  {q.length > 40 ? q.substring(0, 37) + "..." : q}
                </Button>
              ))}
            </div>
          </div>
        )}

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
                  <p className="whitespace-pre-line">{result.analysis}</p>
                </TabsContent>
                
                <TabsContent value="keyPoints">
                  <ul className="list-disc pl-5 space-y-2">
                    {result.key_points?.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    )) || <li>No key points available</li>}
                  </ul>
                </TabsContent>
                
                <TabsContent value="visualization" className="p-4 bg-muted/50 rounded-md">
                  <p className="whitespace-pre-line">{result.visualization_suggestions || "No visualization suggestions available"}</p>
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
