
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  queryPerplexity, 
  sampleQuestions
} from "@/services/perplexityService";
import { Loader2, AlertTriangle, MessageSquare, ChartBar } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AnalysisResult {
  analysis: string;
  key_points: string[];
  visualization_suggestions: string;
  chart_data?: {
    type: 'bar' | 'pie' | 'line' | 'scatter';
    title: string;
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  } | null;
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

  const renderDynamicChart = () => {
    if (!result?.chart_data) return null;
    
    const chartData = result.chart_data;
    const colorPalette = [
      "rgba(255, 99, 132, 0.8)",    // Red
      "rgba(54, 162, 235, 0.8)",    // Blue
      "rgba(75, 192, 192, 0.8)",    // Teal
      "rgba(153, 102, 255, 0.8)",   // Purple
      "rgba(255, 159, 64, 0.8)",    // Orange
      "rgba(255, 205, 86, 0.8)",    // Yellow
      "rgba(201, 203, 207, 0.8)"    // Gray
    ];

    // Generate chart data format for ChartJS
    const data: ChartData<"bar" | "line" | "pie"> = {
      labels: chartData.labels,
      datasets: chartData.datasets.map((dataset, index) => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: chartData.type === 'line' 
          ? colorPalette[index % colorPalette.length].replace('0.8', '0.2')
          : chartData.datasets.map((_, i) => colorPalette[i % colorPalette.length]),
        borderColor: chartData.type === 'line' 
          ? colorPalette[index % colorPalette.length]
          : chartData.datasets.map((_, i) => colorPalette[i % colorPalette.length].replace('0.8', '1')),
        borderWidth: 1,
      })),
    };

    const options: ChartOptions<"bar" | "line" | "pie"> = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: chartData.title,
        },
      },
    };

    switch(chartData.type) {
      case 'bar':
        return <Bar data={data} options={options} />;
      case 'pie':
        return <Pie data={data} options={options} />;
      case 'line':
        return <Line data={data} options={options} />;
      default:
        return <p className="text-muted-foreground">Chart type not supported</p>;
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
              placeholder="Ask any question about PC market data, competitors, or strategies..."
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
          <p className="text-xs text-muted-foreground mt-1">
            Ask any question about market share, growth trends, competitive strategies, or regional performance
          </p>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Sample Questions:</h3>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.slice(0, 4).map((q, i) => (
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
                  <TabsTrigger value="visualization">Visualization</TabsTrigger>
                  <TabsTrigger value="chart">
                    <ChartBar className="mr-2 h-4 w-4" />
                    Dynamic Chart
                  </TabsTrigger>
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

                <TabsContent value="chart" className="p-4 bg-muted/50 rounded-md">
                  <div className="h-[400px] w-full">
                    {result.chart_data ? (
                      renderDynamicChart()
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <AlertTriangle className="h-10 w-10 mb-2" />
                        <p>No chart data available for this query.</p>
                        <p className="text-sm mt-2">Try asking a question that can be visualized with data.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
