import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  getDailyTotalRevenue,
  getDailyTotalCost,
  getDailyNetProfit,
} from "../../../../services/api";
import { useSearchParams } from "react-router-dom";

const TotalRevenueChart = () => {
  const [chartData, setChartData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Read date range from URL params
  const startDateQuery = searchParams.get("startDate") || "";
  const endDateQuery = searchParams.get("endDate") || "";

  const [startDateInput, setStartDateInput] = useState(startDateQuery);
  const [endDateInput, setEndDateInput] = useState(endDateQuery);

  // Fetch and merge data
  useEffect(() => {
    const fetchData = async () => {
      const revenueData = await getDailyTotalRevenue(startDateQuery, endDateQuery);
      const costData = await getDailyTotalCost(startDateQuery, endDateQuery);
      const profitData = await getDailyNetProfit(startDateQuery, endDateQuery);

      // Combine the data based on the `date` key
      const combinedData = revenueData.map((revenue) => {
        const cost = costData.find((item) => item.date === revenue.date) || { cost: 0 };
        const profit = profitData.find((item) => item.date === revenue.date) || { profit: 0 };

        return {
          date: revenue.date,
          revenue: revenue.revenue,
          cost: cost.cost,
          profit: profit.profit,
        };
      });

      setChartData(combinedData);
      console.log(combinedData);
    };

    fetchData();
  }, [startDateQuery, endDateQuery]);

  // Update URL when filters are applied
  const handleFilter = () => {
    setSearchParams({ startDate: startDateInput, endDate: endDateInput });
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Daily Financial Metrics</h2>

      {/* Date Filter */}
      <div className="flex items-center space-x-4 mb-6 justify-center">
        <div>
          <label className="block text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDateInput}
            onChange={(e) => setStartDateInput(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700">End Date</label>
          <input
            type="date"
            value={endDateInput}
            onChange={(e) => setEndDateInput(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <button
          onClick={handleFilter}
          className="px-4 py-2 bg-[#65aa92] text-white rounded-md hover:bg-green-600 transition mt-6"
        >
          Filter
        </button>
      </div>

      {/* Line Chart */}
      <div className="w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis 
                tickFormatter={(value) => `$${Number(value).toFixed(2)}`} // Ensure value is a number
              />
              <Tooltip 
                formatter={(value) => `$${Number(value).toFixed(2)}`} // Ensure value is a number
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#65aa92"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#f56565"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#4c51bf"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          
        ) : (
          <p className="text-center text-gray-500">No data available for the selected range.</p>
        )}
      </div>
    </div>
  );
};

export default TotalRevenueChart;
