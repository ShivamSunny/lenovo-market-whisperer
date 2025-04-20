
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function GrowthComparisonChart() {
  const colorPalette = [
    "rgba(255, 99, 132, 0.8)",    // Lenovo - Red
    "rgba(54, 162, 235, 0.8)",    // HP - Blue
    "rgba(75, 192, 192, 0.8)",    // Dell - Teal
    "rgba(153, 102, 255, 0.8)",   // Apple - Purple
    "rgba(255, 159, 64, 0.8)",    // Acer - Orange
    "rgba(255, 205, 86, 0.8)",    // ASUS - Yellow
    "rgba(201, 203, 207, 0.8)"    // Others - Gray
  ];

  const data: ChartData<"bar"> = {
    labels: marketShareData.brands,
    datasets: [
      {
        label: "YoY Growth (%)",
        data: marketShareData.growth,
        backgroundColor: marketShareData.growth.map((value, index) => 
          value >= 0 ? colorPalette[index] : colorPalette[index].replace("0.8", "0.4")
        ),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
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
            return `${label}: ${value}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Growth Rate (%)",
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Year-over-Year Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
