
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from "chart.js";
import { marketShareData } from "@/services/perplexityService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MarketShareTrendChart() {
  // Generate trend data from current and previous year
  const quarters = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", "Q1 2025"];

  // Create datasets for each brand
  const datasets = marketShareData.brands.map((brand, index) => {
    // Generate trend data (simple linear interpolation between previous and current)
    const previousShare = marketShareData.previousYearShares[index];
    const currentShare = marketShareData.shares[index];
    const step = (currentShare - previousShare) / 4;

    // Generate data points for all quarters
    const trendData = [
      previousShare,
      previousShare + step,
      previousShare + step * 2,
      previousShare + step * 3,
      currentShare,
    ];

    const colorPalette = [
      "rgba(255, 99, 132, 1)",    // Lenovo - Red
      "rgba(54, 162, 235, 1)",    // HP - Blue
      "rgba(75, 192, 192, 1)",    // Dell - Teal
      "rgba(153, 102, 255, 1)",   // Apple - Purple
      "rgba(255, 159, 64, 1)",    // Acer - Orange
      "rgba(255, 205, 86, 1)",    // ASUS - Yellow
      "rgba(201, 203, 207, 1)"    // Others - Gray
    ];

    return {
      label: brand,
      data: trendData,
      borderColor: colorPalette[index],
      backgroundColor: colorPalette[index].replace("1)", "0.1)"),
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 5,
    };
  });

  const data: ChartData<"line"> = {
    labels: quarters,
    datasets: datasets,
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || "";
            const value = context.raw as number;
            return `${label}: ${value.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Market Share (%)",
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Share Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
