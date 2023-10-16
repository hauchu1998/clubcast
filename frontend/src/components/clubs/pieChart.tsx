import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

interface PieChartProps {
  noVotes: number;
  abstainVotes: number;
  yesVotes: number;
}

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({
  noVotes,
  abstainVotes,
  yesVotes,
}: PieChartProps) {
  const data = {
    datasets: [
      {
        label: "# of Votes",
        data: [noVotes, abstainVotes, yesVotes],
        backgroundColor: [
          "rgb(239 68 68)",
          "rgb(59 130 246)",
          "rgb(34 197 94)",
        ],
        borderColor: ["rgb(239 68 68)", "rgb(59 130 246)", "rgb(34 197 94)"],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
}
