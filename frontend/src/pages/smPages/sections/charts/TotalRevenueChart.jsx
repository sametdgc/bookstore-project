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
import { getTotalRevenue } from "../../../../services/api";
import { useSearchParams } from "react-router-dom";

const TotalRevenueChart = () => {
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const startDateQuery = searchParams.get("startDate") || "";
  const endDateQuery = searchParams.get("endDate") || "";

  const [startDateInput, setStartDateInput] = useState(startDateQuery);
  const [endDateInput, setEndDateInput] = useState(endDateQuery);

  // Fetch data
  useEffect(() => {
    const fetchDailyRevenue = async () => {
      const data = await getTotalRevenue(startDateQuery, endDateQuery);
      setDailyRevenue(data);
    };

    fetchDailyRevenue();
  }, [startDateQuery, endDateQuery]);

  const handleFilter = () => {
    setSearchParams({ startDate: startDateInput, endDate: endDateInput });
  };

  // Date range options
  const setDateRange = (range) => {
    const today = new Date();
    let startDate;

    switch (range) {
      case "5Y":
        startDate = new Date(today.setFullYear(today.getFullYear() - 5));
        break;
      case "1Y":
        startDate = new Date(today.setFullYear(today.getFullYear() - 1));
        break;
      case "3M":
        startDate = new Date(today.setMonth(today.getMonth() - 3));
        break;
      case "1M":
        startDate = new Date(today.setMonth(today.getMonth() - 1));
        break;
      case "2W":
        startDate = new Date(today.setDate(today.getDate() - 14));
        break;
      default:
        startDate = new Date();
    }

    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = new Date().toISOString().split("T")[0];

    setStartDateInput(formattedStartDate);
    setEndDateInput(formattedEndDate);
    setSearchParams({ startDate: formattedStartDate, endDate: formattedEndDate });
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Total Revenue Over Time</h2>

      {/* Date Filter */}
      <div className="flex items-center space-x-4 mb-4 justify-center">
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

      {/* Quick Range Buttons */}
      <div className="flex justify-center space-x-2 mb-6">
        {["5Y", "1Y", "3M", "1M", "2W"].map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className="px-3 py-1 bg-gray-200 hover:bg-[#65aa92] hover:text-white rounded transition"
          >
            {range}
          </button>
        ))}
      </div>

      {/* Line Chart */}
      <div className="w-full">
        {dailyRevenue.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dailyRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#65aa92"
                strokeWidth={3}
                dot={(props) => (props.payload.revenue === 0 ? null : <circle {...props} />)}
                connectNulls
                />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">No revenue data for the selected range.</p>
        )}
      </div>
    </div>
  );
};

export default TotalRevenueChart;
