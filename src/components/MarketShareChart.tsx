
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from "chart.js";
import { marketShareData } from "@/services/perplexityService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MarketShareChart() {
  const colorPalette = [
    "rgba(255, 99, 132, 0.8)",    // Lenovo - Red
    "rgba(54, 162, 235, 0.8)",    // HP - Blue
    "rgba(75, 192, 192, 0.8)",    // Dell - Teal
    "rgba(153, 102, 255, 0.8)",   // Apple - Purple
    "rgba(255, 159, 64, 0.8)",    // Acer - Orange
    "rgba(255, 205, 86, 0.8)",    // ASUS - Yellow
    "rgba(201, 203, 207, 0.8)"    // Others - Gray
  ];

  const data: ChartData<"pie"> = {
    labels: marketShareData.brands,
    datasets: [
      {
        data: marketShareData.shares,
        backgroundColor: colorPalette,
        borderColor: colorPalette.map(color => color.replace("0.8", "1")),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || "";
            const value = context.raw as number;
            return `${label}: ${value}%`;
          }
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>PC Market Share (Q1 2025)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full flex items-center justify-center">
          <Pie data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
