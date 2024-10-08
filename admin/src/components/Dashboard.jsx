import { MdIcons } from "../assets/Icons/icons";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import TopDetails from "./TopDetails";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard(props) {
  const data = {
    labels: [
      "Accounting",
      "Science",
      "Wildlife",
      "Full Stack",
      "Website Apps",
      "Energy",
      "Retail Sales",
      "Robotics",
      "Hospitality",
      "Others",
    ],
    datasets: [
      {
        label: "Overview",
        data: [12, 43, 21, 1, 45, 32, 65, 7, 3, 20],
        backgroundColor: [
          "rgba(0, 123, 255, 0.6)",
          "rgba(32, 201, 151, 0.6)",
          "rgba(23, 162, 184, 0.6)",
          "rgba(102, 16, 242, 0.6)",
          "rgba(40, 167, 69, 0.6)",
          "rgba(13, 110, 253, 0.6)",
          "rgba(111, 66, 193, 0.6)",
          "rgba(77, 189, 116, 0.6)",
          "rgba(52, 58, 64, 0.6)",
          "rgba(253, 126, 20, 0.6)",
        ],
        hoverBackgroundColor: [
          "rgba(0, 123, 255, 0.8)",
          "rgba(32, 201, 151, 0.8)",
          "rgba(23, 162, 184, 0.8)",
          "rgba(102, 16, 242, 0.8)",
          "rgba(40, 167, 69, 0.8)",
          "rgba(13, 110, 253, 0.8)",
          "rgba(111, 66, 193, 0.8)",
          "rgba(77, 189, 116, 0.8)",
          "rgba(52, 58, 64, 0.8)",
          "rgba(253, 126, 20, 0.8)",
        ],
        borderColor: "transparent",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
          autoSkip: false,
          padding: 20,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          padding: 20,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    hover: {
      mode: "index",
      intersect: false,
    },
    elements: {
      bar: {
        borderRadius: 10,
        barPercentage: 0.9,
        categoryPercentage: 0.8,
      },
    },
  };

  return (
    <section className="dashboard section">
      <TopDetails title="Welcome, Admin " navbar={props.navContainerRef} />
      <div className="overview">
        <div className="title">Dashboard Overview</div>
        <div className="boxesContainer">
          <div className="boxes">
            <div className="top">Pending post</div>
            <div className="detail">
              <span>
                <MdIcons.MdOutlinePendingActions />
              </span>
              345
            </div>
          </div>
          <div className="boxes">
            <div className="top">Approved post</div>{" "}
            <div className="detail">
              <span>
                <MdIcons.MdOutlineDoneAll />
              </span>
              65
            </div>
          </div>
          <div className="boxes">
            <div className="top">Total post</div>
            <div className="detail">
              <span>
                <MdIcons.MdOutlineWork />
              </span>
              {345 + 65}
            </div>
          </div>
        </div>
        <div className="graphContainer">
          <Bar data={data} options={options} />
        </div>
      </div>
    </section>
  );
}
