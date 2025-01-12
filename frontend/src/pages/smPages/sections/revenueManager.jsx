import React, { useState } from "react";
import TotalRevenueChart from "./charts/TotalRevenueChart";
import DailyRevenueChart from "./charts/DailyRevenueChart";
import TopCustomersChart from "./charts/TopCustomersChart";
import RevenueByCategoryChart from "./charts/RevenueByCategoryChart";
import RevenueCompositionChart from "./charts/RevenueCompositionChart";

const RevenueManager = () => {
  const chartOptions = [
    { id: "totalRevenue", label: "Total Revenue" },
    { id: "dailyRevenue", label: "Daily Revenue" },
    { id: "topCustomers", label: "Top Customers" },
    { id: "revenueByCategory", label: "Categories" },
    { id: "revenueComposition", label: "Revenue Composition" },
  ];

  const [selectedChart, setSelectedChart] = useState(chartOptions[0].id);

  const renderChart = () => {
    switch (selectedChart) {
      case "totalRevenue":
        return <TotalRevenueChart />;
      case "dailyRevenue":
        return <DailyRevenueChart />;
      case "topCustomers":
        return <TopCustomersChart />;
      case "revenueByCategory":
        return <RevenueByCategoryChart />;
      case "revenueComposition":
        return <RevenueCompositionChart />;
      default:
        return <TotalRevenueChart />;
    }
  };

  return (
    <div className="flex bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full">
        <h1 className="text-3xl font-semibold text-[#65aa92] mb-6">Revenue Manager</h1>

        {/* Buttons for Chart Selection */}
        <div className="flex flex-wrap justify-between mb-8">
          {chartOptions.map((button) => (
            <button
              key={button.id}
              title={`View ${button.label}`}
              className={`px-4 py-2 rounded transition-all duration-300 ${
                selectedChart === button.id
                  ? "bg-[#65aa92] text-white font-semibold mr-2 ml-2"
                  : "bg-gray-200 text-gray-700 hover:bg-green-100 mr-2 ml-2"
              }`}
              onClick={() => setSelectedChart(button.id)}
            >
              {button.label}
            </button>
          ))}
        </div>

        {/* Render Selected Chart */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner flex justify-center items-center">
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default RevenueManager;
