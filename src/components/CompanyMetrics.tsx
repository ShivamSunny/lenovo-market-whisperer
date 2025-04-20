
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { marketShareData } from "@/services/perplexityService";

export default function CompanyMetrics() {
  // Find index of Lenovo in the brands array
  const lenovoIndex = marketShareData.brands.findIndex(brand => brand === "Lenovo");
  
  // Extract Lenovo's data
  const lenovoShare = marketShareData.shares[lenovoIndex];
  const lenovoGrowth = marketShareData.growth[lenovoIndex];
  const lenovoPrevShare = marketShareData.previousYearShares[lenovoIndex];
  
  // Calculate market leadership margin (difference from second-place)
  const sortedShares = [...marketShareData.shares].sort((a, b) => b - a);
  const leadershipMargin = sortedShares[0] - sortedShares[1];
  
  // Calculate market share change
  const shareChange = lenovoShare - lenovoPrevShare;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Market Share</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lenovoShare}%</div>
          <p className="text-xs text-muted-foreground">
            <span className={shareChange >= 0 ? "text-green-500" : "text-red-500"}>
              {shareChange >= 0 ? "+" : ""}{shareChange.toFixed(1)}%
            </span>{" "}
            from last year
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">YoY Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lenovoGrowth}%</div>
          <p className="text-xs text-muted-foreground">
            Outpacing market average
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Leadership Margin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{leadershipMargin.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Ahead of second-place competitor
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Market Position</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">#1</div>
          <p className="text-xs text-muted-foreground">
            Global PC vendor by market share
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
