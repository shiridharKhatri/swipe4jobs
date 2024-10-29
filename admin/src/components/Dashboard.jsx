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
import Cookies from "js-cookie";
import TopDetails from "./TopDetails";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export default function Dashboard({ navContainerRef, fetchOveriew }) {
  let navigate = useNavigate();
  const [allData, setAllData] = useState({});
  const [analyticsData, setAnaData] = useState({ key: [], val: [] });
  const [isLoading, seIsLoading] = useState(true);

  useEffect(() => {
    seIsLoading(true);
    fetchOveriew().then((res) => {
      if (res.success === true) {
        seIsLoading(false);
        setAllData(res.data);
        let positions = [];
        let count = [];
        for (let key in res.data.overview) {
          positions.push(key);
          count.push(res.data.overview[key]);
        }
        setAnaData({ key: positions, val: count });
      } else {
        Cookies.remove("admin-id");
        Cookies.remove("admin-token");
        navigate("/");
      }
    });
  }, [fetchOveriew]);

  const data = {
    labels: analyticsData?.key,
    datasets: [
      {
        label: "Overview",
        data: analyticsData?.val,
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
      <TopDetails title="Welcome, Admin " navbar={navContainerRef} />

      {isLoading && <Loader />}
      {!isLoading && (
        <div className="overview">
          <div className="title">Dashboard Overview</div>
          <div className="boxesContainer">
            <div className="boxes">
              <div className="top">Pending post</div>
              <div className="detail">
                <span>
                  <MdIcons.MdOutlinePendingActions />
                </span>
                {allData?.pending}
              </div>
            </div>
            <div className="boxes">
              <div className="top">Approved post</div>{" "}
              <div className="detail">
                <span>
                  <MdIcons.MdOutlineDoneAll />
                </span>
                {allData?.approved}
              </div>
            </div>
            <div className="boxes">
              <div className="top">Total post</div>
              <div className="detail">
                <span>
                  <MdIcons.MdOutlineWork />
                </span>
                {allData?.total}
              </div>
            </div>
          </div>
          <div className="graphContainer">
            <Bar data={data} options={options} />
          </div>
        </div>
      )}
    </section>
  );
}
